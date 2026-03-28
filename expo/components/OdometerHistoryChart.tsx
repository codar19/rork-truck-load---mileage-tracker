import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { OdometerReading } from '@/types/load';
import { TrendingUp } from 'lucide-react-native';

interface OdometerHistoryChartProps {
  readings: OdometerReading[];
  claimedMiles: number;
}

const CHART_HEIGHT = 200;
const CHART_PADDING = 20;

export default function OdometerHistoryChart({ readings, claimedMiles }: OdometerHistoryChartProps) {
  console.log('[OdometerHistoryChart] Rendering with readings:', readings.length);

  const chartData = useMemo(() => {
    if (readings.length === 0) {
      console.log('[OdometerHistoryChart] No readings available');
      return null;
    }

    const sortedReadings = [...readings].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const minReading = Math.min(...sortedReadings.map(r => r.reading));
    const maxReading = Math.max(...sortedReadings.map(r => r.reading));
    const range = maxReading - minReading;

    console.log('[OdometerHistoryChart] Min:', minReading, 'Max:', maxReading, 'Range:', range);

    const chartWidth = Dimensions.get('window').width - 40 - CHART_PADDING * 2;
    const chartHeight = CHART_HEIGHT - CHART_PADDING * 2;

    const points = sortedReadings.map((reading, index) => {
      const x = (index / Math.max(sortedReadings.length - 1, 1)) * chartWidth;
      const normalizedValue = range > 0 ? (reading.reading - minReading) / range : 0.5;
      const y = chartHeight - (normalizedValue * chartHeight);

      return {
        x,
        y,
        reading,
        index,
      };
    });

    return {
      points,
      minReading,
      maxReading,
      range,
      chartWidth,
      chartHeight,
    };
  }, [readings]);

  if (!chartData || chartData.points.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TrendingUp size={32} color="#64748b" />
        <Text style={styles.emptyText}>No odometer data available</Text>
      </View>
    );
  }

  const { points, minReading, maxReading } = chartData;

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'received':
        return 'Received';
      case 'pickup':
        return 'Pickup';
      case 'delivery':
        return 'Delivery';
      default:
        return stage;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'received':
        return '#3b82f6';
      case 'pickup':
        return '#f59e0b';
      case 'delivery':
        return '#22c55e';
      default:
        return '#64748b';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={20} color="#f59e0b" />
        <Text style={styles.title}>Odometer History</Text>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.yAxisLabels}>
          <Text style={styles.yAxisLabel}>{maxReading.toLocaleString()}</Text>
          <Text style={styles.yAxisLabel}>
            {Math.round((minReading + maxReading) / 2).toLocaleString()}
          </Text>
          <Text style={styles.yAxisLabel}>{minReading.toLocaleString()}</Text>
        </View>

        <View style={styles.chartArea}>
          <View style={[styles.chart, { height: CHART_HEIGHT }]}>
            <View style={styles.gridLines}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>

            <View style={styles.chartContent}>
              {points.map((point, index) => {
                if (index === 0) return null;
                
                const prevPoint = points[index - 1];
                const lineWidth = Math.sqrt(
                  Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
                );
                const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x) * (180 / Math.PI);

                return (
                  <View
                    key={`line-${index}`}
                    style={[
                      styles.line,
                      {
                        position: 'absolute' as const,
                        left: CHART_PADDING + prevPoint.x,
                        top: CHART_PADDING + prevPoint.y,
                        width: lineWidth,
                        transform: [{ rotate: `${angle}deg` }],
                      },
                    ]}
                  />
                );
              })}

              {points.map((point, index) => (
                <View
                  key={`point-${index}`}
                  style={[
                    styles.pointContainer,
                    {
                      position: 'absolute' as const,
                      left: CHART_PADDING + point.x - 6,
                      top: CHART_PADDING + point.y - 6,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.point,
                      { backgroundColor: getStageColor(point.reading.stage) },
                    ]}
                  />
                  {index === 0 || index === points.length - 1 ? (
                    <View style={styles.labelContainer}>
                      <Text style={styles.pointLabel}>
                        {point.reading.reading.toLocaleString()}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.xAxisLabels}>
            {points.map((point, index) => (
              <View key={`label-${index}`} style={styles.xAxisLabelContainer}>
                <Text style={styles.xAxisLabel}>{getStageLabel(point.reading.stage)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
          <Text style={styles.legendText}>Received</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
          <Text style={styles.legendText}>Pickup</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.legendText}>Delivery</Text>
        </View>
      </View>

      {chartData.range > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Miles</Text>
            <Text style={styles.statValue}>{chartData.range.toLocaleString()}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Claimed Miles</Text>
            <Text style={styles.statValue}>{claimedMiles.toLocaleString()}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Variance</Text>
            <Text
              style={[
                styles.statValue,
                chartData.range > claimedMiles ? styles.warningValue : styles.successValue,
              ]}
            >
              {chartData.range > claimedMiles ? '+' : ''}
              {(chartData.range - claimedMiles).toLocaleString()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
  },
  chartContainer: {
    flexDirection: 'row',
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    paddingRight: 8,
    height: CHART_HEIGHT,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'right' as const,
  },
  chartArea: {
    flex: 1,
  },
  chart: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  gridLines: {
    position: 'absolute' as const,
    top: CHART_PADDING,
    left: CHART_PADDING,
    right: CHART_PADDING,
    bottom: CHART_PADDING,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#334155',
    opacity: 0.3,
  },
  chartContent: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
  },
  line: {
    height: 2,
    backgroundColor: '#f59e0b',
    transformOrigin: '0% 50%',
  },
  pointContainer: {
    position: 'absolute' as const,
  },
  point: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  labelContainer: {
    position: 'absolute' as const,
    top: -20,
    left: -20,
    width: 52,
    alignItems: 'center',
  },
  pointLabel: {
    fontSize: 10,
    color: '#cbd5e1',
    fontWeight: '600' as const,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  xAxisLabelContainer: {
    flex: 1,
    alignItems: 'center',
  },
  xAxisLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#f1f5f9',
  },
  warningValue: {
    color: '#f59e0b',
  },
  successValue: {
    color: '#22c55e',
  },
});
