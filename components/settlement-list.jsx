"use client";

import { useState } from "react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight } from "lucide-react";
import Link from "next/link";

export function SettlementList({
  settlements,
  isGroupSettlement = false,
  userLookupMap,
}) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  console.log("settlements", settlements);

  if (!settlements || !settlements.length) {
    return (
      <Card className="border-dashed border-muted-foreground/30 bg-muted/40">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No settlements found
        </CardContent>
      </Card>
    );
  }

  // Helper to get user details from cache or look up
  const getUserDetails = (userId) => {
    // Simplified fallback
    return {
      name:
        userId === currentUser?._id
          ? "You"
          : userLookupMap[userId]?.name || "Other User",
      imageUrl: null,
      id: userId,
    };
  };

  return (
    <div className="flex flex-col gap-3">
      {settlements.map((settlement) => {
        const payer = getUserDetails(settlement.paidByUserId);
        const receiver = getUserDetails(settlement.receivedByUserId);
        const isCurrentUserPayer = settlement.paidByUserId === currentUser?._id;
        const isCurrentUserReceiver =
          settlement.receivedByUserId === currentUser?._id;

        return (
          <Card
            className="group border-muted/60 bg-card/80 shadow-sm shadow-black/5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md"
            key={settlement._id}
          >
            <CardContent className="py-4 px-4 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  {/* Settlement icon */}
                  <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary shadow-inner shadow-primary/20">
                    <ArrowLeftRight className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium sm:text-base">
                      {isCurrentUserPayer
                        ? `You paid ${receiver.name}`
                        : isCurrentUserReceiver
                        ? `${payer.name} paid you`
                        : `${payer.name} paid ${receiver.name}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-foreground/80">
                        {format(new Date(settlement.date), "MMM d, yyyy")}
                      </span>
                      {settlement.note && (
                        <>
                          <span className="text-muted-foreground/60">•</span>
                          <span className="line-clamp-1 max-w-xs">
                            {settlement.note}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 text-right">
                  <div className="text-base font-semibold sm:text-lg">
                    <span className="tabular-nums">
                      ${settlement.amount.toFixed(2)}
                    </span>
                  </div>
                  {isGroupSettlement ? (
                    <Badge
                      variant="outline"
                      className="border-primary/40 bg-primary/5 text-[11px] font-medium text-primary"
                    >
                      Group settlement
                    </Badge>
                  ) : (
                    <div className="text-xs font-medium text-muted-foreground sm:text-sm">
                      {isCurrentUserPayer ? (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-600">
                          You paid
                        </span>
                      ) : isCurrentUserReceiver ? (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600">
                          You received
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-2 py-0.5">
                          Payment
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
