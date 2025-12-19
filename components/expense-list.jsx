"use client";

import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getCategoryById } from "@/lib/expense-categories";
import { getCategoryIcon } from "@/lib/expense-categories";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ExpenseList({
  expenses,
  showOtherPerson = true,
  isGroupExpense = false,
  otherPersonId = null,
  userLookupMap = {},
}) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const deleteExpense = useConvexMutation(api.expenses.deleteExpense);

  if (!expenses || !expenses.length) {
    return (
      <Card className="border-dashed border-muted-foreground/30 bg-muted/40">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No expenses found
        </CardContent>
      </Card>
    );
  }

  // Helper to get user details from cache or look up from expense
  const getUserDetails = (userId) => {
    // For the group context, we need to look up members from somewhere else
    // This is a simplified fallback
    return {
      name:
        userId === currentUser?._id
          ? "You"
          : userLookupMap[userId]?.name || "Other User",
      imageUrl: null,
      id: userId,
    };
  };

  // Check if the user can delete an expense (creator or payer)
  const canDeleteExpense = (expense) => {
    if (!currentUser) return false;
    return (
      expense.createdBy === currentUser._id ||
      expense.paidByUserId === currentUser._id
    );
  };

  // Handle delete expense
  const handleDeleteExpense = async (expense) => {
    // Use basic JavaScript confirm
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteExpense.mutate({ expenseId: expense._id });
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error("Failed to delete expense: " + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {expenses.map((expense) => {
        const payer = getUserDetails(expense.paidByUserId, expense);
        const isCurrentUserPayer = expense.paidByUserId === currentUser?._id;
        const category = getCategoryById(expense.category);
        const CategoryIcon = getCategoryIcon(category.id);
        const showDeleteOption = canDeleteExpense(expense);

        return (
          <Card
            className="group border-border/70 bg-card/80 shadow-sm shadow-black/5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card hover:shadow-md"
            key={expense._id}
          >
            <CardContent className="py-4 px-4 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-1 items-start gap-3">
                  {/* Category icon */}
                  <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary shadow-inner shadow-primary/20">
                    <CategoryIcon className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium sm:text-base">
                      {expense.description}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-foreground/75">
                        {format(new Date(expense.date), "MMM d, yyyy")}
                      </span>
                      {showOtherPerson && (
                        <>
                          <span className="text-muted-foreground/60">•</span>
                          <span>
                            {isCurrentUserPayer ? "You" : payer.name} paid
                          </span>
                        </>
                      )}
                      {category?.label && (
                        <>
                          <span className="text-muted-foreground/60">•</span>
                          <span className="rounded-full bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary">
                            {category.label}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:items-start">
                  <div className="text-right">
                    <div className="text-base font-semibold tracking-tight sm:text-lg">
                      <span className="tabular-nums">
                        ${expense.amount.toFixed(2)}
                      </span>
                    </div>
                    {isGroupExpense ? (
                      <Badge
                        variant="outline"
                        className="mt-1 border-primary/40 bg-primary/5 text-[11px] font-medium text-primary"
                      >
                        Group expense
                      </Badge>
                    ) : (
                      <div className="mt-0.5 text-xs font-medium text-muted-foreground sm:text-sm">
                        {isCurrentUserPayer ? (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600">
                            You paid
                          </span>
                        ) : (
                          <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-rose-600">
                            {payer.name} paid
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {showDeleteOption && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-rose-500 transition hover:bg-rose-500/10 hover:text-rose-600"
                      onClick={() => handleDeleteExpense(expense)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete expense</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Display splits info */}
              <div className="mt-3 border-t border-border/70 pt-3 text-sm">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Split details
                </div>
                <div className="flex flex-wrap gap-2">
                  {expense.splits.map((split, idx) => {
                    const splitUser = getUserDetails(split.userId, expense);
                    const isCurrentUser = split.userId === currentUser?._id;
                    const shouldShow =
                      showOtherPerson ||
                      (!showOtherPerson &&
                        (split.userId === currentUser?._id ||
                          split.userId === otherPersonId));

                    if (!shouldShow) return null;

                    return (
                      <Badge
                        key={idx}
                        variant={split.paid ? "outline" : "secondary"}
                        className={`flex items-center gap-1 rounded-full border-border/60 px-2 py-0.5 text-xs ${
                          split.paid
                            ? "bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <Avatar className="h-4 w-4 border border-border/60">
                          <AvatarImage src={splitUser.imageUrl} />
                          <AvatarFallback className="text-[10px] font-semibold">
                            {splitUser.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="whitespace-nowrap">
                          {isCurrentUser ? "You" : splitUser.name}: $
                          {split.amount.toFixed(2)}
                        </span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
