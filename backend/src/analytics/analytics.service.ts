import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackVisit(path: string, sessionId: string) {
    try {
      await this.prisma.pageVisit.create({
        data: {
          path,
          sessionId,
        },
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to track visit:', error);
      return { success: false };
    }
  }

  async getStats() {
    const visits = await this.prisma.pageVisit.findMany({
      select: {
        path: true,
        sessionId: true,
      },
    });

    const stats = visits.reduce(
      (
        acc: Record<string, { views: number; uniqueVisitors: Set<string> }>,
        visit,
      ) => {
        if (!acc[visit.path]) {
          acc[visit.path] = { views: 0, uniqueVisitors: new Set<string>() };
        }
        acc[visit.path].views += 1;
        acc[visit.path].uniqueVisitors.add(visit.sessionId);
        return acc;
      },
      {} as Record<string, { views: number; uniqueVisitors: Set<string> }>,
    );

    const formattedStats = Object.entries(stats)
      .map(
        ([path, data]: [
          string,
          { views: number; uniqueVisitors: Set<string> },
        ]) => ({
          path,
          views: data.views,
          uniqueVisitors: data.uniqueVisitors.size,
        }),
      )
      .sort((a, b) => b.views - a.views);

    const totalViews = visits.length;
    const totalUniqueVisitors = new Set(visits.map((v) => v.sessionId)).size;

    return {
      totalViews,
      totalUniqueVisitors,
      pages: formattedStats,
    };
  }

  async getAiStats() {
    const totalQueries = await this.prisma.aiQuery.count();

    const topQueries = await this.prisma.aiQuery.groupBy({
      by: ['question'],
      _count: { question: true },
      _sum: { rating: true },
    });

    const formattedTopQueries = topQueries
      .map((q) => ({
        question: q.question,
        timesAsked: q._count.question,
        rating: q._sum.rating || 0,
      }))
      .sort((a, b) => b.rating - a.rating);

    return {
      totalQueries,
      topQueries: formattedTopQueries,
    };
  }
}
