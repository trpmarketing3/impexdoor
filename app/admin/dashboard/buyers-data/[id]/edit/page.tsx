"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

interface BuyerData {
  id: string;
  category: string;
  title: string;
  description: string | null;
  buyer_from: string | null;
  quantity: string | null;
  destination: string | null;
  payment_terms: string | null;
  looking_suppliers_from: string | null;
  status: string | null;
}

export default function EditBuyerDataPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [buyerData, setBuyerData] = useState<BuyerData | null>(null);
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch buyer data
  useEffect(() => {
    const fetchBuyerData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/buyers-data?activeOnly=false&perPage=1000`);
        const result = await response.json();
        
        if (result.success && result.data) {
          const buyer = result.data.find((b: BuyerData) => b.id === id);
          if (buyer) {
            setBuyerData(buyer);
            setCategory(buyer.category || CATEGORY_OPTIONS[0]);
            setStatus(buyer.status || "Active");
          } else {
            setError("Buyer data not found.");
          }
        } else {
          setError("Failed to load buyer data.");
        }
      } catch (err) {
        setError("Failed to load buyer data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBuyerData();
    }
  }, [id]);

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
      status,
    };

    if (!payload.title) {
      setError("Title is required.");
      setSuccess(null);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/buyers-data?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result?.message ?? "Unable to update buyer data. Please try again."
        );
        return;
      }

      setSuccess("Buyer requirement updated successfully.");
      setTimeout(() => {
        router.push("/admin/dashboard/buyers-data");
      }, 1500);
    } catch (apiError) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-center py-12 px-4">
          <p className="text-sm sm:text-base text-slate-600">Loading buyer data...</p>
        </div>
      </section>
    );
  }

  if (error && !buyerData) {
    return (
      <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-sm sm:text-base text-red-600 mb-4 text-center">{error}</p>
          <Link
            href="/admin/dashboard/buyers-data"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to buyers data</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            Edit Buyer Requirement
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Update buyer requirement details.
          </p>
        </div>
        <Link
          href="/admin/dashboard/buyers-data"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800 whitespace-nowrap"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to buyers data</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
        <form className="mx-auto grid max-w-3xl gap-4 sm:gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-700">
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
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-700">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                defaultValue={buyerData?.title || ""}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Add a clear listing title"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-700">
                Buyer From
              </label>
              <input
                type="text"
                name="buyerFrom"
                defaultValue={buyerData?.buyer_from || ""}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Country or region"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-700">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                defaultValue={buyerData?.destination || ""}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Delivery location"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                defaultValue={buyerData?.quantity || ""}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="e.g. 5,000 units"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={4}
              name="description"
              defaultValue={buyerData?.description || ""}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Include order details, certifications, delivery timelines..."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-700">
                Payment Terms
              </label>
              <input
                type="text"
                name="paymentTerms"
                defaultValue={buyerData?.payment_terms || ""}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="e.g. 30% advance"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-700">
                Looking Suppliers From
              </label>
              <input
                type="text"
                name="lookingSuppliersFrom"
                defaultValue={buyerData?.looking_suppliers_from || ""}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Preferred sourcing countries"
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-lg border border-red-100 bg-red-50 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-emerald-600">
              {success}
            </p>
          ) : null}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <Link
              href="/admin/dashboard/buyers-data"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">{saving ? "Updating..." : "Update Requirement"}</span>
              <span className="sm:hidden">{saving ? "Updating..." : "Update"}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

