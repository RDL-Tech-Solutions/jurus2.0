import React from 'react';

const TesteFavoritos: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste - Seção de Favoritos</h1>
      <p className="text-gray-600">
        Este é um componente de teste para verificar se a seção de favoritos está funcionando.
      </p>
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800">
          Se você consegue ver esta mensagem, o problema não está na navegação ou no roteamento.
        </p>
      </div>
    </div>
  );
};

export default TesteFavoritos;