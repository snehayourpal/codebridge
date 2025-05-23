interface PageProps {
  content: any;
}

export function HomePage({ content }: PageProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gray-50">
        <h1 className="text-4xl font-bold mb-4 text-black">
          {content?.businessInfo?.name || 'Welcome to Our Business'}
        </h1>
        <p className="text-xl text-black max-w-2xl mx-auto">
          {content?.businessInfo?.description || 'Your trusted business partner'}
        </p>
      </div>

      {/* Services Preview */}
      {content?.services && content.services.length > 0 && (
        <div className="py-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.services.map((service: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold mb-2 text-black">{service.title}</h3>
                <p className="text-black">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AboutPage({ content }: PageProps) {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-black">About Us</h1>
      {content?.businessInfo?.mission && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3 text-black">Our Mission</h2>
          <p className="text-black">{content.businessInfo.mission}</p>
        </div>
      )}
      <div className="prose lg:prose-lg">
        {content?.sections?.map((section: any) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">{section.title}</h2>
            <p className="text-black">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServicesPage({ content }: PageProps) {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-black">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {content?.services?.map((service: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-3 text-black">{service.title}</h2>
            <p className="text-black mb-4">{service.description}</p>
            {service.price && (
              <p className="text-black font-semibold">{service.price}</p>
            )}
            {service.features && service.features.length > 0 && (
              <ul className="mt-4 space-y-2">
                {service.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center text-black">
                    <span className="mr-2 text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactPage({ content }: PageProps) {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-black">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-black">Get in Touch</h2>
          {content?.businessInfo?.contact && (
            <div className="space-y-4">
              {content.businessInfo.contact.email && (
                <p className="flex items-center text-black">
                  <span className="mr-2">📧</span>
                  {content.businessInfo.contact.email}
                </p>
              )}
              {content.businessInfo.contact.phone && (
                <p className="flex items-center text-black">
                  <span className="mr-2">📞</span>
                  {content.businessInfo.contact.phone}
                </p>
              )}
              {content.businessInfo.contact.address && (
                <p className="flex items-center text-black">
                  <span className="mr-2">📍</span>
                  {content.businessInfo.contact.address}
                </p>
              )}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-black">Business Hours</h2>
          {content?.businessInfo?.contact?.hours && (
            <ul className="space-y-2">
              {content.businessInfo.contact.hours.map((hour: string, index: number) => (
                <li key={index} className="text-black">{hour}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 