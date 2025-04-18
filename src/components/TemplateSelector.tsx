import { AppTemplate } from '@/lib/types';

export default function TemplateSelector({
  templates,
  onSelect
}: {
  templates: AppTemplate[];
  onSelect: (template: AppTemplate) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {templates.map(template => (
        <div
          key={template.id}
          onClick={() => onSelect(template)}
          className="border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <h3 className="text-xl font-bold">{template.name}</h3>
          <p className="text-gray-600 mt-2">{template.description}</p>
          <div className="mt-4 text-sm text-blue-600">Use Template</div>
        </div>
      ))}
    </div>
  );
}