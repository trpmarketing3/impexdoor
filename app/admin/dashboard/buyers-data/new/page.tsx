"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BUYER_CATEGORIES,
  DEFAULT_BUYER_CATEGORY,
} from "@/lib/constants/buyer-categories";

const CATEGORY_OPTIONS = BUYER_CATEGORIES.filter(
  (category) => category !== DEFAULT_BUYER_CATEGORY
);

export default function NewBuyerDataPage() {
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      category,
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      buyerFrom: String(formData.get("buyerFrom") ?? "").trim(),
      quantity: String(formData.get("quantity") ?? "").trim(),
      destination: String(formData.get("destination") ?? "").trim(),
      paymentTerms: String(formData.get("paymentTerms") ?? "").trim(),
      lookingSuppliersFrom: String(
        formData.get("lookingSuppliersFrom") ?? ""
      ).trim(),
    };

    if (!payload.title) {
      setError("Title is required.");
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/buyers-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result?.message ?? "Unable to publish buyer data. Please try again."
        );
        return;
      }

      setSuccess("Buyer requirement published successfully.");
      form.reset();
      setCategory(CATEGORY_OPTIONS[0]);
    } catch (apiError) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Create Buyer Requirement
          </h1>
          <p className="text-sm text-slate-500">
            Publish detailed buyer asks to help sellers respond quickly.
          </p>
        </div>
        <Link
          href="/admin/dashboard/buyers-data"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to buyers data
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <form className="mx-auto grid max-w-3xl gap-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Category
            </label>
            <Select
              value={category}
              onValueChange={(value) =>
                setCategory(value as (typeof CATEGORY_OPTIONS)[number])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Add a clear listing title"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Buyer From
              </label>
              <input
                type="text"
                name="buyerFrom"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Country or region"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Delivery location"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="e.g. 5,000 units"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={4}
              name="description"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Include order details, certifications, delivery timelines..."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Payment Terms
              </label>
              <input
                type="text"
                name="paymentTerms"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="e.g. 30% advance"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Looking Suppliers From
              </label>
              <input
                type="text"
                name="lookingSuppliersFrom"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Preferred sourcing countries"
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
              {success}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/admin/dashboard/buyers-data"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              {loading ? "Publishing..." : "Publish Requirement"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
