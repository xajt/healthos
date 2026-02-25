"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Widget,
  WidgetType,
  WIDGET_CONFIGS,
  DEFAULT_WIDGETS,
} from "./widgets/types";
import { WidgetWrapper } from "./widgets/widget-wrapper";
import {
  WeightTrendWidget,
  demoWeightData,
  MoodTrackerWidget,
  demoMoodEntries,
  SleepQualityWidget,
  demoSleepData,
  CalorieHistoryWidget,
  demoCalorieData,
  ActivitySummaryWidget,
  demoActivityData,
  SupplementChecklistWidget,
  demoSupplements,
} from "./widgets";

interface WidgetsContainerProps {
  initialWidgets?: Widget[];
  onLayoutChange?: (widgets: Widget[]) => void;
}

export function WidgetsContainer({
  initialWidgets = DEFAULT_WIDGETS,
  onLayoutChange,
}: WidgetsContainerProps) {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = widgets.findIndex((w) => w.id === active.id);
        const newIndex = widgets.findIndex((w) => w.id === over.id);
        const newWidgets = arrayMove(widgets, oldIndex, newIndex);
        setWidgets(newWidgets);
        onLayoutChange?.(newWidgets);
      }
    },
    [widgets, onLayoutChange]
  );

  const handleRemoveWidget = useCallback(
    (id: string) => {
      const newWidgets = widgets.filter((w) => w.id !== id);
      setWidgets(newWidgets);
      onLayoutChange?.(newWidgets);
    },
    [widgets, onLayoutChange]
  );

  const handleAddWidget = useCallback(
    (type: WidgetType) => {
      const config = WIDGET_CONFIGS[type];
      const newWidget: Widget = {
        id: `${type}-${Date.now()}`,
        type,
        title: config.title,
        size: config.defaultSize,
      };
      const newWidgets = [...widgets, newWidget];
      setWidgets(newWidgets);
      onLayoutChange?.(newWidgets);
      setShowAddModal(false);
    },
    [widgets, onLayoutChange]
  );

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case "weight-trend":
        return <WeightTrendWidget data={demoWeightData} />;
      case "mood-tracker":
        return <MoodTrackerWidget entries={demoMoodEntries} />;
      case "sleep-quality":
        return <SleepQualityWidget data={demoSleepData} />;
      case "calorie-history":
        return <CalorieHistoryWidget data={demoCalorieData} />;
      case "activity-summary":
        return <ActivitySummaryWidget data={demoActivityData} />;
      case "supplement-checklist":
        return <SupplementChecklistWidget supplements={demoSupplements} />;
      default:
        return <p>Unknown widget type</p>;
    }
  };

  const availableWidgetTypes = Object.values(WIDGET_CONFIGS).filter(
    (config) => !widgets.some((w) => w.type === config.type)
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Widgety</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isEditing
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {isEditing ? "Gotowe" : "Edytuj"}
          </button>
        </div>
      </div>

      {/* Add Widget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">
              Dodaj widget
            </h3>
            <div className="space-y-2">
              {availableWidgetTypes.map((config) => (
                <button
                  key={config.type}
                  onClick={() => handleAddWidget(config.type)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-colors text-left"
                >
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <p className="font-medium text-zinc-900">{config.title}</p>
                    <p className="text-sm text-zinc-500">{config.description}</p>
                  </div>
                </button>
              ))}
              {availableWidgetTypes.length === 0 && (
                <p className="text-center text-zinc-500 py-4">
                  Wszystkie widgety zostały już dodane
                </p>
              )}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full mt-4 py-2 text-sm text-zinc-600 hover:text-zinc-900"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Widgets Grid */}
      {widgets.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={widgets.map((w) => w.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {widgets.map((widget) => (
                <WidgetWrapper
                  key={widget.id}
                  widget={widget}
                  isEditing={isEditing}
                  onRemove={handleRemoveWidget}
                >
                  {renderWidgetContent(widget)}
                </WidgetWrapper>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center">
          <p className="text-zinc-500">Brak widgetów</p>
          <p className="text-sm text-zinc-400 mt-1">
            Dodaj widgety, aby spersonalizować swój dashboard
          </p>
        </div>
      )}

      {/* Add Widget Button */}
      {isEditing && availableWidgetTypes.length > 0 && (
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-500 hover:border-zinc-300 hover:text-zinc-600 transition-colors"
        >
          + Dodaj widget
        </button>
      )}
    </div>
  );
}
