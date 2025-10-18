import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  DollarSign,
  Plus
} from 'lucide-react';
import { MetaFinanceira } from '../types/metas';
import { formatCurrency } from '../utils/formatters';

interface TimelineMetasProps {
  className?: string;
}

interface EventoTimeline {
  id: string;
  data: Date;
  tipo: 'inicio' | 'marco' | 'prazo' | 'contribuicao' | 'conclusao';
  meta: MetaFinanceira;
  titulo: string;
  descricao: string;
  valor?: number;
  percentual?: number;
  status: 'passado' | 'presente' | 'futuro';
}

const TimelineMetas: React.FC<TimelineMetasProps> = ({ className = '' }) => {
  const { metas, calcularProgressoMeta } = useMetas();

  // Gerar eventos da timeline
  const eventos = useMemo(() => {
    const eventosTimeline: EventoTimeline[] = [];
    const hoje = new Date();

    metas.forEach(meta => {
      const progresso = calcularProgressoMeta(meta.id);
      
      // Evento de início
      eventosTimeline.push({
        id: `${meta.id}-inicio`,
        data: new Date(meta.dataInicio),
        tipo: 'inicio',
        meta,
        titulo: `Início: ${meta.nome}`,
        descricao: `Meta criada com objetivo de ${formatCurrency(meta.valorObjetivo)}`,
        status: new Date(meta.dataInicio) <= hoje ? 'passado' : 'futuro'
      });

      // Marcos de progresso atingidos
      if (progresso) {
        progresso.marcos.forEach(marco => {
          if (marco.atingido && marco.data) {
            eventosTimeline.push({
              id: `${meta.id}-marco-${marco.percentual}`,
              data: new Date(marco.data),
              tipo: 'marco',
              meta,
              titulo: `Marco: ${marco.percentual}%`,
              descricao: `${meta.nome} atingiu ${marco.percentual}% do objetivo`,
              percentual: marco.percentual,
              status: new Date(marco.data) <= hoje ? 'passado' : 'futuro'
            });
          }
        });
      }

      // Contribuições recentes (últimas 10)
      meta.historico.slice(-10).forEach(item => {
        if (item.tipo === 'deposito') {
          eventosTimeline.push({
            id: `${meta.id}-contrib-${item.data.getTime()}`,
            data: new Date(item.data),
            tipo: 'contribuicao',
            meta,
            titulo: 'Contribuição',
            descricao: item.descricao || `Contribuição para ${meta.nome}`,
            valor: item.valor,
            status: new Date(item.data) <= hoje ? 'passado' : 'futuro'
          });
        }
      });

      // Evento de prazo
      const dataObjetivo = new Date(meta.dataObjetivo);
      eventosTimeline.push({
        id: `${meta.id}-prazo`,
        data: dataObjetivo,
        tipo: 'prazo',
        meta,
        titulo: `Prazo: ${meta.nome}`,
        descricao: `Data limite para atingir o objetivo de ${formatCurrency(meta.valorObjetivo)}`,
        status: dataObjetivo <= hoje ? 'passado' : 'futuro'
      });

      // Evento de conclusão (se concluída)
      if (meta.status === 'concluida') {
        // Assumir que foi concluída na data do último depósito que atingiu o objetivo
        const ultimaContribuicao = meta.historico[meta.historico.length - 1];
        if (ultimaContribuicao) {
          eventosTimeline.push({
            id: `${meta.id}-conclusao`,
            data: new Date(ultimaContribuicao.data),
            tipo: 'conclusao',
            meta,
            titulo: `Concluída: ${meta.nome}`,
            descricao: `Meta finalizada com sucesso!`,
            status: 'passado'
          });
        }
      }
    });

    // Ordenar por data
    return eventosTimeline.sort((a, b) => a.data.getTime() - b.data.getTime());
  }, [metas, calcularProgressoMeta]);

  // Agrupar eventos por mês
  const eventosPorMes = useMemo(() => {
    const grupos: { [key: string]: EventoTimeline[] } = {};
    
    eventos.forEach(evento => {
      const chave = `${evento.data.getFullYear()}-${evento.data.getMonth()}`;
      if (!grupos[chave]) {
        grupos[chave] = [];
      }
      grupos[chave].push(evento);
    });

    return Object.entries(grupos).map(([chave, eventosDoMes]) => {
      const [ano, mes] = chave.split('-').map(Number);
      const data = new Date(ano, mes, 1);
      return {
        data,
        eventos: eventosDoMes.sort((a, b) => a.data.getTime() - b.data.getTime())
      };
    }).sort((a, b) => a.data.getTime() - b.data.getTime());
  }, [eventos]);

  const getIconeEvento = (tipo: EventoTimeline['tipo']) => {
    switch (tipo) {
      case 'inicio':
        return <Target className="h-5 w-5" />;
      case 'marco':
        return <TrendingUp className="h-5 w-5" />;
      case 'contribuicao':
        return <Calendar className="h-5 w-5" />;
      case 'prazo':
        return <Clock className="h-5 w-5" />;
      case 'conclusao':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getCorEvento = (evento: EventoTimeline) => {
    if (evento.status === 'passado') {
      switch (evento.tipo) {
        case 'inicio':
          return 'bg-blue-100 text-blue-600 border-blue-200';
        case 'marco':
          return 'bg-green-100 text-green-600 border-green-200';
        case 'contribuicao':
          return 'bg-purple-100 text-purple-600 border-purple-200';
        case 'prazo':
          return evento.meta.status === 'concluida' 
            ? 'bg-green-100 text-green-600 border-green-200'
            : 'bg-red-100 text-red-600 border-red-200';
        case 'conclusao':
          return 'bg-green-100 text-green-600 border-green-200';
        default:
          return 'bg-gray-100 text-gray-600 border-gray-200';
      }
    } else {
      return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const formatarMes = (data: Date) => {
    return data.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (eventos.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-8 text-center ${className}`}>
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Timeline vazia</h3>
        <p className="text-gray-500">Crie metas financeiras para visualizar sua jornada</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <AnimatedContainer className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Timeline das Metas</h2>
        </div>

        {/* Estatísticas da Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Total de Eventos</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{eventos.length}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Marcos Atingidos</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {eventos.filter(e => e.tipo === 'marco' && e.status === 'passado').length}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Contribuições</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {eventos.filter(e => e.tipo === 'contribuicao').length}
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">Próximos Prazos</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">
              {eventos.filter(e => e.tipo === 'prazo' && e.status === 'futuro').length}
            </p>
          </div>
        </div>
      </AnimatedContainer>

      {/* Timeline */}
      <AnimatedContainer className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          {/* Linha vertical da timeline */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-8">
            {eventosPorMes.map((grupo, grupoIndex) => (
              <AnimatedItem key={grupo.data.getTime()} delay={grupoIndex * 0.1}>
                <div>
                  {/* Header do mês */}
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      {formatarMes(grupo.data)}
                    </div>
                  </div>

                  {/* Eventos do mês */}
                  <div className="space-y-4">
                    {grupo.eventos.map((evento, eventoIndex) => (
                      <div key={evento.id} className="relative flex items-start space-x-4">
                        {/* Ícone do evento */}
                        <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${getCorEvento(evento)}`}>
                          {getIconeEvento(evento.tipo)}
                        </div>

                        {/* Conteúdo do evento */}
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {evento.titulo}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {evento.descricao}
                                </p>
                                
                                {/* Informações adicionais */}
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span>
                                    {evento.data.toLocaleDateString('pt-BR')}
                                  </span>
                                  {evento.valor && (
                                    <span className="font-medium text-green-600">
                                      {formatCurrency(evento.valor)}
                                    </span>
                                  )}
                                  {evento.percentual && (
                                    <span className="font-medium text-blue-600">
                                      {evento.percentual}%
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Badge da meta */}
                              <div className="ml-4">
                                <span 
                                  className="inline-block px-2 py-1 text-xs font-medium rounded-full"
                                  style={{ 
                                    backgroundColor: evento.meta.cor + '20',
                                    color: evento.meta.cor 
                                  }}
                                >
                                  {evento.meta.nome}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>

          {/* Indicador de futuro */}
          <div className="relative flex items-center space-x-4 mt-8">
            <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-gray-300 bg-white">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300">
                <h4 className="text-sm font-semibold text-gray-600">
                  Futuro
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Continue contribuindo para suas metas e acompanhe seu progresso
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default TimelineMetas;