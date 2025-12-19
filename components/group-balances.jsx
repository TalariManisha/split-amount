"use client";

import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

/**
 * Expected `balances` shape (one object per member):
 * {
 *   id:           string;           // user id
 *   name:         string;
 *   imageUrl?:    string;
 *   totalBalance: number;           // + ve ⇒ they are owed, – ve ⇒ they owe
 *   owes:   { to: string;   amount: number }[];  // this member → others
 *   owedBy: { from: string; amount: number }[];  // others → this member
 * }
 */
export function GroupBalances({ balances }) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  /* ───── guards ────────────────────────────────────────────────────────── */
  if (!balances?.length || !currentUser) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        No balance information available
      </div>
    );
  }

  /* ───── helpers ───────────────────────────────────────────────────────── */
  const me = balances.find((b) => b.id === currentUser._id);
  if (!me) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        You’re not part of this group
      </div>
    );
  }

  const userMap = Object.fromEntries(balances.map((b) => [b.id, b]));

  // Who owes me?
  const owedByMembers = me.owedBy
    .map(({ from, amount }) => ({ ...userMap[from], amount }))
    .sort((a, b) => b.amount - a.amount);

  // Whom do I owe?
  const owingToMembers = me.owes
    .map(({ to, amount }) => ({ ...userMap[to], amount }))
    .sort((a, b) => b.amount - a.amount);

  const isAllSettledUp =
    me.totalBalance === 0 &&
    owedByMembers.length === 0 &&
    owingToMembers.length === 0;

  /* ───── UI ────────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-5 rounded-xl border border-border bg-card/80 p-4 shadow-sm shadow-black/5">
      {/* Current user's total balance */}
      <div className="border-b border-border/70 pb-4 text-center">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Your balance
        </p>
        <p
          className={`text-2xl font-semibold tracking-tight ${
            me.totalBalance > 0
              ? "text-emerald-600"
              : me.totalBalance < 0
              ? "text-rose-600"
              : "text-foreground"
          }`}
        >
          {me.totalBalance > 0
            ? `+$${me.totalBalance.toFixed(2)}`
            : me.totalBalance < 0
            ? `-$${Math.abs(me.totalBalance).toFixed(2)}`
            : "$0.00"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {me.totalBalance > 0
            ? "You are owed money"
            : me.totalBalance < 0
            ? "You owe money"
            : "You are all settled up"}
        </p>
      </div>

      {isAllSettledUp ? (
        <div className="rounded-lg bg-muted/60 py-4 text-center text-sm text-muted-foreground">
          Everyone is settled up!
        </div>
      ) : (
        <div className="space-y-5">
          {/* People who owe the current user */}
          {owedByMembers.length > 0 && (
            <div className="rounded-lg bg-emerald-50/70 p-3 dark:bg-emerald-950/40">
              <h3 className="mb-3 flex items-center text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                <ArrowUpCircle className="mr-2 h-4 w-4 text-emerald-500" />
                Owed to you
              </h3>
              <div className="space-y-2.5">
                {owedByMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-md px-1 py-1.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 border border-emerald-100 dark:border-emerald-900/50">
                        <AvatarImage src={member.imageUrl} />
                        <AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-50">
                          {member.name?.charAt(0) ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground">
                        {member.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      ${member.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* People the current user owes */}
          {owingToMembers.length > 0 && (
            <div className="rounded-lg bg-rose-50/70 p-3 dark:bg-rose-950/40">
              <h3 className="mb-3 flex items-center text-xs font-semibold uppercase tracking-wide text-rose-800 dark:text-rose-300">
                <ArrowDownCircle className="mr-2 h-4 w-4 text-rose-500" />
                You owe
              </h3>
              <div className="space-y-2.5">
                {owingToMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-md px-1 py-1.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 border border-rose-100 dark:border-rose-900/50">
                        <AvatarImage src={member.imageUrl} />
                        <AvatarFallback className="bg-rose-100 text-xs font-semibold text-rose-800 dark:bg-rose-900/60 dark:text-rose-50">
                          {member.name?.charAt(0) ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground">
                        {member.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                      ${member.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
