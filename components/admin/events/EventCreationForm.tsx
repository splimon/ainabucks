// components/admin/events/EventCreationForm.tsx
// Main form component for creating volunteer events

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EventCreationSchema,
  type EventCreationInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createEvent } from "@/lib/admin/actions/events";

const EventCreationForm = () => {
  const router = useRouter();

  // State for dynamic array inputs
  // These manage the "What to Bring" and "Requirements" lists
  const [whatToBringItems, setWhatToBringItems] = useState<string[]>([""]);
  const [requirementItems, setRequirementItems] = useState<string[]>([""]);

  // Initialize react-hook-form with Zod validation
  const form = useForm({
    resolver: zodResolver(EventCreationSchema), // Validates on submit
    defaultValues: {
      // Basic Information
      title: "",
      category: "",
      description: "",
      imageUrl: "",

      // Date & Time
      date: "",
      startTime: "",
      endTime: "",

      // Location
      locationName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",

      // Volunteers & Rewards
      volunteersNeeded: 0,
      ainaBucks: 0,
      bucksPerHour: 0,
      duration: 0,

      // Arrays
      whatToBring: [],
      requirements: [],

      // Coordinator
      coordinatorName: "",
      coordinatorEmail: "",
      coordinatorPhone: "",
    },
  } as const);

  /**
   * Handle form submission
   * 1. Filter out empty array items
   * 2. Call server action
   * 3. Handle success/error response
   */
  const onSubmit = async (data: EventCreationInput) => {
    // Remove empty strings from dynamic arrays
    const filteredWhatToBring = whatToBringItems.filter(
      (item) => item.trim() !== "",
    );
    const filteredRequirements = requirementItems.filter(
      (item) => item.trim() !== "",
    );

    // Prepare final event data
    const eventData = {
      ...data,
      whatToBring: filteredWhatToBring,
      requirements: filteredRequirements,
    };

    // Call server action to create event
    const result = await createEvent(eventData);

    // Handle response
    if (result.success) {
      // Success: Show toast and navigate to event page
      toast.success("Event created successfully!");
      router.push(`/admin/events`); // Or `/admin/events/${result.data.id}` for detail page
    } else {
      // Error: Show error message
      toast.error(result.error || "Failed to create event");
    }
  };

  // ============================================
  // WHAT TO BRING - Array Management Functions
  // ============================================

  const addWhatToBringItem = () => {
    setWhatToBringItems([...whatToBringItems, ""]);
  };

  const removeWhatToBringItem = (index: number) => {
    setWhatToBringItems(whatToBringItems.filter((_, i) => i !== index));
  };

  const updateWhatToBringItem = (index: number, value: string) => {
    const updated = [...whatToBringItems];
    updated[index] = value;
    setWhatToBringItems(updated);
  };

  // ============================================
  // REQUIREMENTS - Array Management Functions
  // ============================================

  const addRequirementItem = () => {
    setRequirementItems([...requirementItems, ""]);
  };

  const removeRequirementItem = (index: number) => {
    setRequirementItems(requirementItems.filter((_, i) => i !== index));
  };

  const updateRequirementItem = (index: number, value: string) => {
    const updated = [...requirementItems];
    updated[index] = value;
    setRequirementItems(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600 mt-2">
          Create a new volunteer opportunity for your community
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* ========================================== */}
          {/* BASIC INFORMATION SECTION */}
          {/* ========================================== */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Event Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Food Bank Sorting & Distribution"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Community Service, Environmental"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the volunteer opportunity, what volunteers will do, and the impact they'll make..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Photo URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/event-photo.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add a photo URL to make your event more
                      appealing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ========================================== */}
          {/* DATE & TIME SECTION */}
          {/* ========================================== */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Date & Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Time */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Time */}
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ========================================== */}
          {/* LOCATION SECTION */}
          {/* ========================================== */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Location</h2>

            <div className="space-y-6">
              {/* Location Name */}
              <FormField
                control={form.control}
                name="locationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Hawaii Foodbank Warehouse"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Street Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2611 Kilihau St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City, State, Zip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Honolulu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="HI"
                          maxLength={2}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="96819" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* VOLUNTEERS & REWARDS SECTION */}
          {/* ========================================== */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Volunteers & Rewards
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Volunteers Needed */}
              <FormField
                control={form.control}
                name="volunteersNeeded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volunteers Needed *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="20"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Total number of volunteer spots available
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="4"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      How many hours will volunteers work?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Total Aina Bucks */}
              <FormField
                control={form.control}
                name="ainaBucks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total ʻĀina Bucks *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="60"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Total reward amount for completion
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bucks Per Hour */}
              <FormField
                control={form.control}
                name="bucksPerHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bucks Per Hour *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="15"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Reward rate per hour of volunteering
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ========================================== */}
          {/* WHAT TO BRING SECTION */}
          {/* ========================================== */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  What to Bring
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  List items volunteers should bring (optional)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWhatToBringItem}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {whatToBringItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="e.g., Closed-toe shoes (required for safety)"
                    value={item}
                    onChange={(e) =>
                      updateWhatToBringItem(index, e.target.value)
                    }
                    className="flex-1"
                  />
                  {whatToBringItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWhatToBringItem(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ========================================== */}
          {/* REQUIREMENTS SECTION */}
          {/* ========================================== */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Requirements
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  List any requirements or qualifications (optional)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirementItem}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Requirement
              </Button>
            </div>

            <div className="space-y-3">
              {requirementItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="e.g., Must be at least 16 years old"
                    value={item}
                    onChange={(e) =>
                      updateRequirementItem(index, e.target.value)
                    }
                    className="flex-1"
                  />
                  {requirementItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirementItem(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ========================================== */}
          {/* EVENT COORDINATOR SECTION */}
          {/* ========================================== */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Event Coordinator
            </h2>

            <div className="space-y-6">
              {/* Coordinator Name */}
              <FormField
                control={form.control}
                name="coordinatorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coordinator Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Sarah Johnson" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Coordinator Email */}
              <FormField
                control={form.control}
                name="coordinatorEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coordinator Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="sarah@hawaiifoodbank.org"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Coordinator Phone */}
              <FormField
                control={form.control}
                name="coordinatorPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coordinator Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(808) 555-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ========================================== */}
          {/* SUBMIT BUTTONS */}
          {/* ========================================== */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-8"
            >
              Create Event
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventCreationForm;
