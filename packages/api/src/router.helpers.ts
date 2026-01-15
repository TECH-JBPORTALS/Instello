import type { db } from "@instello/db/client";

import type { Context } from "./trpc";

export type DbClient = typeof db;
export type DbTransaction = Parameters<DbClient["transaction"]>[0] extends (
  tx: infer T,
) => unknown
  ? T
  : never;

export type DbLike = DbTransaction;

export function withTx(ctx: Context, tx: DbTransaction) {
  return { ...ctx, db: tx };
}

export async function getClerkUserById(userId: string, ctx: Context) {
  return ctx.clerk.users
    .getUser(userId)
    .then(({ firstName, fullName, lastName, imageUrl, hasImage }) => ({
      firstName,
      lastName,
      fullName,
      imageUrl,
      hasImage,
    }));
}

export async function getClerkUserByEmail(email: string, ctx: Context) {
  return ctx.clerk.users.getUserList({ emailAddress: [email] }).then((r) => {
    const user = r.data[0];

    return {
      firstName: user?.firstName,
      lastName: user?.lastName,
      fullName: user?.fullName,
      imageUrl: user?.imageUrl,
      hasImage: user?.hasImage,
    };
  });
}
