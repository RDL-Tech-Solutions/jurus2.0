import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout';
import Home from '../pages/Home';
import { Metas } from '../pages/Metas';
import { Historico } from '../pages/Historico';
import { Comparacao } from '../pages/Comparacao';
import { Planejamento } from '../pages/Planejamento';
import { Configuracoes } from '../pages/Configuracoes';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="metas" element={<Metas />} />
          <Route path="historico" element={<Historico />} />
          <Route path="comparacao" element={<Comparacao />} />
          <Route path="planejamento" element={<Planejamento />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
