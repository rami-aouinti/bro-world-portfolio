import { z } from "zod";

export const analyticsRangeSchema = z.enum(["24h", "7d", "30d", "90d"]);

export const analyticsTimeseriesPointSchema = z.object({
  timestamp: z.string(),
  visitors: z.number(),
  pageViews: z.number(),
});

export const analyticsTopPageSchema = z.object({
  path: z.string(),
  views: z.number(),
  visitors: z.number().optional().default(0),
});

export const analyticsPerformanceMetricSchema = z.object({
  metric: z.string(),
  p75: z.number(),
});

export const analyticsPersonalizedMessageSchema = z.object({
  audience: z.string(),
  headline: z.string(),
  body: z.string(),
});

export const analyticsTotalsSchema = z.object({
  visitors: z.object({
    current: z.number(),
    previous: z.number().nullable(),
    change: z.number().nullable(),
  }),
  pageViews: z.object({
    current: z.number(),
    previous: z.number().nullable(),
    change: z.number().nullable(),
  }),
  averageDuration: z.object({
    current: z.number(),
    previous: z.number().nullable(),
    change: z.number().nullable(),
  }),
});

export const analyticsLiveResponseSchema = z.object({
  range: analyticsRangeSchema,
  generatedAt: z.string(),
  totals: analyticsTotalsSchema,
  series: z.array(analyticsTimeseriesPointSchema),
  topPages: z.array(analyticsTopPageSchema),
  performance: z.array(analyticsPerformanceMetricSchema),
  personalizedMessages: z.array(analyticsPersonalizedMessageSchema).optional().default([]),
});

export type AnalyticsRange = z.infer<typeof analyticsRangeSchema>;
export type AnalyticsTimeseriesPoint = z.infer<typeof analyticsTimeseriesPointSchema>;
export type AnalyticsTopPage = z.infer<typeof analyticsTopPageSchema>;
export type AnalyticsPerformanceMetric = z.infer<typeof analyticsPerformanceMetricSchema>;
export type AnalyticsPersonalizedMessage = z.infer<typeof analyticsPersonalizedMessageSchema>;
export type AnalyticsTotals = z.infer<typeof analyticsTotalsSchema>;
export type AnalyticsLiveResponse = z.infer<typeof analyticsLiveResponseSchema>;
