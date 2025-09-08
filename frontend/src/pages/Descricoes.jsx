import React from 'react';
import { DescricaoProvider } from '../context/DescricaoContext.jsx';
import DescricaoList from '../components/descricoes/DescricaoList.jsx';

const Descricoes = () => {
  return (
    <DescricaoProvider>
      <div className="p-4 sm:p-6">
        <DescricaoList />
      </div>
    </DescricaoProvider>
  );
};

export default Descricoes;