import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { WhatsAppFloatingButton } from './WhatsAppFloatingButton';
import { ServiceDetailModal } from '../services/ServiceDetailModal';
import { Service } from '../../types';

export const PublicLayout: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenServiceDetails = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#231F20] selection:bg-[#EBDBC9] selection:text-[#2D2726]">
      <PublicNavbar />
      <main className="flex-grow">
        <Outlet context={{ onOpenServiceDetails: handleOpenServiceDetails }} />
      </main>
      <PublicFooter />
      <WhatsAppFloatingButton />

      {/* Global Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
