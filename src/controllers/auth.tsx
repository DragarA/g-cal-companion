import { OAuthRequestError } from "@lucia-auth/oauth";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { parseCookie, serializeCookie } from "lucia/utils";
import { googleAuth } from "../auth";
import { config } from "../config";
import { ctx } from "../context";
import { user as dbUser } from "../db/primary/schema";
import { redirect, syncIfLocal } from "../lib";

export const authController = new Elysia({
  prefix: "/auth",
})
  .use(ctx)
  .get("/signout", async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    if (!session) {
      redirect(
        {
          set: ctx.set,
          headers: ctx.headers,
        },
        "/",
      );
      return;
    }

    await ctx.auth.invalidateSession(session.sessionId);

    const sessionCookie = ctx.auth.createSessionCookie(null);

    ctx.set.headers["Set-Cookie"] = sessionCookie.serialize();
    redirect(
      {
        set: ctx.set,
        headers: ctx.headers,
      },
      "/",
    );
  })
  .get("/login/google", async ({ set }) => {
    const [url, state] = await googleAuth.getAuthorizationUrl();

    const state_cookie = serializeCookie("google_auth_state", state, {
      maxAge: 60 * 60,
      httpOnly: true,
      secure: config.env.NODE_ENV === "production",
      path: "/",
    });

    set.headers["Set-Cookie"] = state_cookie;

    set.redirect = url.toString();
  })
  .get("/callback/google", async ({ set, query, headers, auth, log, db }) => {
    const { state, code } = query;

    const cookies = parseCookie(headers.cookie || "");
    const state_cookie = cookies.google_auth_state;

    if (!state_cookie || !state || state_cookie !== state || !code) {
      set.status = "Unauthorized";
      return;
    }

    try {
      const { createUser, getExistingUser, googleUser, googleTokens } =
        await googleAuth.validateCallback(code);

      console.log(googleTokens);

      const getUser = async () => {
        const existingUser = await getExistingUser();

        if (existingUser) {
          await db
            .update(dbUser)
            .set({
              access_token: googleTokens.accessToken,
            })
            .where(eq(dbUser.id, existingUser.id))
            .returning();

          return existingUser;
        }

        const usr = await createUser({
          attributes: {
            name: googleUser.name,
            email: googleUser.email ?? null,
            picture: googleUser.picture,
            access_token: googleTokens.accessToken,
            refresh_token: googleTokens.refreshToken,
            token_expires_in: googleTokens.accessTokenExpiresIn,
          },
        });

        return usr;
      };

      const user = await getUser();
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      const sessionCookie = auth.createSessionCookie(session);

      await syncIfLocal();

      set.headers["Set-Cookie"] = sessionCookie.serialize();
      redirect(
        {
          set,
          headers,
        },
        "/dashboard",
      );
    } catch (e) {
      log.error(e, "Error signing in with Google");
      if (e instanceof OAuthRequestError) {
        set.status = "Unauthorized";
        return;
      } else {
        set.status = "Internal Server Error";
        return;
      }
    }
  });
