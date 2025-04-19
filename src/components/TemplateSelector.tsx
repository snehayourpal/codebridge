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
          className="box cursor-pointer hover:shadow-lg transition-shadow bg-gray-900 flex flex-col h-full"
        >
          <div className="flex-grow">
            <h3 className="text-xl text-white font-bold">{template.name}</h3>
            <p className="mt-2 text-gray-300">{template.description}</p>
          </div>
          <div className="mt-auto pt-4 text-sm text-white">Use Template</div>
        </div>
      ))}
    </div>
  );
}