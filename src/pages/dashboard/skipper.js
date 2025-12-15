import { useState } from 'react';
import { PageLayout } from '../../components/page-layout';
import BoatCard from '../../components/boat/card';
import RequestCard from '../../components/crew/requestcard';
import EventCard from '../../components/events/event-card';

// Sample boat data
const sampleBoats = [
  {
    id: '1',
    name: 'Ocean Explorer',
    description: 'A luxurious yacht perfect for family outings and corporate events. Features include a jacuzzi, BBQ area, and water sports equipment.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    capacity: 12,
    length: 45,
    pricePerDay: 1200,
    type: 'Luxury Yacht'
  },
  {
    id: '2',
    name: 'Sea Breeze',
    description: 'Comfortable and agile sailboat ideal for day trips and sunset cruises. Perfect for small groups looking for an authentic sailing experience.',
    image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    capacity: 6,
    length: 32,
    pricePerDay: 450,
    type: 'Sailboat'
  },
  {
    id: '3',
    name: 'Wave Runner',
    description: 'Fast and powerful speed boat for thrill-seekers. Comes with snorkeling gear and a professional guide.',
    image: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    capacity: 8,
    length: 28,
    pricePerDay: 650,
    type: 'Speed Boat'
  },
  {
    id: '4',
    name: 'The Mariner',
    description: 'Spacious and stable catamaran perfect for larger groups. Features include multiple decks and a professional crew.',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    capacity: 20,
    length: 52,
    pricePerDay: 1800,
    type: 'Catamaran'
  },
];

// Sample crew request data
const sampleCrewRequests = [
  {
    id: 101,
    name: 'John Doe',
    boatId: 1,
    boatName: 'Ocean Explorer',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    profileId: 501,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
  },
  {
    id: 102,
    name: 'Jane Smith',
    boatId: 2,
    boatName: 'Sea Breeze',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    profileId: 502,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'System',
  },
  {
    id: 103,
    name: 'Mike Johnson',
    boatId: 1,
    boatName: 'Ocean Explorer',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    profileId: 503,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    createdBy: 'System',
  }
];

// Sample events data
const sampleEvents = [
  {
    id: 201,
    name: 'Annual Regatta',
    date: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
    description: 'Join us for the annual summer regatta. Open to all sailboats under 40ft.',
    confirmedCrew: 15,
    wantedCrew: 20
  },
  {
    id: 202,
    name: 'Sunset Charity Cruise',
    date: new Date(Date.now() + 86400000 * 25).toISOString(), // 25 days from now
    description: 'A charity event to raise funds for ocean conservation. Black tie optional.',
    confirmedCrew: 8,
    wantedCrew: 10
  },
  {
    id: 203,
    name: 'Skipper Training Workshop',
    date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    description: 'Advanced navigation and safety workshop for certified skippers.',
    confirmedCrew: 5,
    wantedCrew: 12
  }
];

export const SkipperDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredBoats = sampleBoats.filter(boat => {
    const matchesSearch = boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || boat.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Get unique boat types for filter
  const boatTypes = ['all', ...new Set(sampleBoats.map(boat => boat.type))];

  return (
    <PageLayout>
      <div className="w-full px-1 py-8">


        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Upcoming Events */}
          <div className="w-full lg:w-2/3 border-2 border-green-500 p-2 rounded">
            <h2 className="text-2xl font-bold text-skipper-primary !pt-0 !mt-0 mb-6">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 gap-6 h-[340px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {sampleEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Right Column: Boat Grid */}
          <div className="w-full lg:w-1/3 border-2 border-red-500 p-2 rounded">
            <h1 className="text-4xl font-bold text-skipper-primary !pt-0 !mt-0">
              My Fleet
            </h1>
            {filteredBoats.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 h-[340px] overflow-y-auto pb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {filteredBoats.map(boat => (
                  <div key={boat.id} className="flex justify-center">
                    <BoatCard boat={boat} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No boats found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Crew Requests Section */}
        <div className="mt-12 border-2 border-blue-500 px-2 pb-2 pt-0 rounded">
          <h2 className="text-2xl font-bold text-skipper-primary !pt-0 !mt-0 mb-4">
            Crew Requests
          </h2>
          <div className="space-y-4">
            {sampleCrewRequests.map(request => (
              <RequestCard
                key={request.id}
                request={request}
                onAccept={(id) => console.log('Accept request', id)}
                onDelete={(id) => console.log('Delete request', id)}
              />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};