import { FormularioEntrada } from '../components/FormularioEntrada';
import { ResultadoSimulacao } from '../components/ResultadoSimulacao';
import { ListaBancos } from '../components/ListaBancos';
import { GraficoResumoHome } from '../components/GraficoResumoHome';

export default function Home() {
  return (
    <div className="page-container space-y-6">
      <FormularioEntrada />
      <GraficoResumoHome />
      <ResultadoSimulacao />
      <ListaBancos />
    </div>
  );
}