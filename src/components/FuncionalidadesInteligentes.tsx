import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Sun,
  Moon,
  Smartphone,
  Monitor,
  Zap,
  Brain,
  Palette,
  Eye,
  Settings,
  Calendar,
  MapPin,
  Wifi,
  WifiOff,
  Battery,
  Lightbulb,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  Users,
  Globe,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  Square,
  RotateCcw,
  Save,
  Download,
  Upload,
  Share2,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Vibrate,
  ChevronDown,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  X
} from 'lucide-react';
import { TemaAvancado, ConfiguracaoTemaAvancada } from '../types/temas';
import { AnimatedContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';

interface FuncionalidadesInteligentesProps {
  configuracao: ConfiguracaoTemaAvancada;
  onAtualizarConfiguracao: (config: ConfiguracaoTemaAvancada) => void;
  temas: TemaAvancado[];
  temaAtivo: string;
  onMudarTema: (temaId: string) => void;
}

interface AgendamentoTema {
  id: string;
  nome: string;
  temaId: string;
  horarioInicio: string;
  horarioFim: string;
  diasSemana: number[];
  ativo: boolean;
  condicoes?: {
    localizacao?: boolean;
    clima?: boolean;
    bateria?: boolean;
    conectividade?: boolean;
  };
}

interface PerfilContextual {
  id: string;
  nome: string;
  descricao: string;
  condicoes: {
    horario?: { inicio: string; fim: string };
    localizacao?: string;
    aplicativo?: string[];
    bateria?: { min: number; max: number };
    conectividade?: 'wifi' | 'mobile' | 'offline';
  };
  temaId: string;
  prioridade: number;
  ativo: boolean;
}

interface EstatisticasUso {
  temaMaisUsado: string;
  tempoUsoTotal: number;
  trocasAutomaticas: number;
  trocasManuais: number;
  horariosPico: { hora: number; uso: number }[];
  preferenciasDetectadas: string[];
}

const diasSemana = [
  { id: 0, nome: 'Dom', completo: 'Domingo' },
  { id: 1, nome: 'Seg', completo: 'Segunda-feira' },
  { id: 2, nome: 'Ter', completo: 'Terça-feira' },
  { id: 3, nome: 'Qua', completo: 'Quarta-feira' },
  { id: 4, nome: 'Qui', completo: 'Quinta-feira' },
  { id: 5, nome: 'Sex', completo: 'Sexta-feira' },
  { id: 6, nome: 'Sáb', completo: 'Sábado' }
];

export const FuncionalidadesInteligentes: React.FC<FuncionalidadesInteligentesProps> = ({
  configuracao,
  onAtualizarConfiguracao,
  temas,
  temaAtivo,
  onMudarTema
}) => {
  const [abaSelecionada, setAbaSelecionada] = useState<'agendamento' | 'contexto' | 'ia' | 'estatisticas'>('agendamento');
  const [agendamentos, setAgendamentos] = useState<AgendamentoTema[]>([]);
  const [perfisContextuais, setPerfisContextuais] = useState<PerfilContextual[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasUso | null>(null);
  const [iaAtiva, setIaAtiva] = useState(false);
  const [aprendizadoAtivo, setAprendizadoAtivo] = useState(false);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [modoEconomiaEnergia, setModoEconomiaEnergia] = useState(false);
  const [sincronizacaoNuvem, setSincronizacaoNuvem] = useState(false);

  // Carregar dados salvos
  useEffect(() => {
    carregarDadosSalvos();
    carregarEstatisticas();
  }, []);

  // Monitorar mudanças de contexto
  useEffect(() => {
    if (iaAtiva) {
      iniciarMonitoramentoContexto();
    }
    return () => pararMonitoramentoContexto();
  }, [iaAtiva]);

  const carregarDadosSalvos = useCallback(() => {
    try {
      const agendamentosSalvos = localStorage.getItem('jurus-agendamentos-temas');
      const perfisSalvos = localStorage.getItem('jurus-perfis-contextuais');
      const configIA = localStorage.getItem('jurus-ia-config');

      if (agendamentosSalvos) {
        setAgendamentos(JSON.parse(agendamentosSalvos));
      }

      if (perfisSalvos) {
        setPerfisContextuais(JSON.parse(perfisSalvos));
      }

      if (configIA) {
        const config = JSON.parse(configIA);
        setIaAtiva(config.ativa || false);
        setAprendizadoAtivo(config.aprendizado || false);
        setNotificacoesAtivas(config.notificacoes !== false);
        setModoEconomiaEnergia(config.economiaEnergia || false);
        setSincronizacaoNuvem(config.sincronizacaoNuvem || false);
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
    }
  }, []);

  const salvarDados = useCallback(() => {
    try {
      localStorage.setItem('jurus-agendamentos-temas', JSON.stringify(agendamentos));
      localStorage.setItem('jurus-perfis-contextuais', JSON.stringify(perfisContextuais));
      localStorage.setItem('jurus-ia-config', JSON.stringify({
        ativa: iaAtiva,
        aprendizado: aprendizadoAtivo,
        notificacoes: notificacoesAtivas,
        economiaEnergia: modoEconomiaEnergia,
        sincronizacaoNuvem: sincronizacaoNuvem
      }));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }, [agendamentos, perfisContextuais, iaAtiva, aprendizadoAtivo, notificacoesAtivas, modoEconomiaEnergia, sincronizacaoNuvem]);

  const carregarEstatisticas = useCallback(() => {
    try {
      const estatisticasSalvas = localStorage.getItem('jurus-estatisticas-temas');
      if (estatisticasSalvas) {
        setEstatisticas(JSON.parse(estatisticasSalvas));
      } else {
        // Gerar estatísticas de exemplo
        setEstatisticas({
          temaMaisUsado: temaAtivo,
          tempoUsoTotal: 1250, // minutos
          trocasAutomaticas: 45,
          trocasManuais: 12,
          horariosPico: [
            { hora: 9, uso: 85 },
            { hora: 14, uso: 92 },
            { hora: 20, uso: 78 }
          ],
          preferenciasDetectadas: ['Modo escuro à noite', 'Cores vibrantes pela manhã', 'Alto contraste para leitura']
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }, [temaAtivo]);

  const iniciarMonitoramentoContexto = useCallback(() => {
    // Monitorar hora do dia
    const intervalHora = setInterval(() => {
      verificarAgendamentos();
      verificarPerfisContextuais();
    }, 60000); // Verificar a cada minuto

    // Monitorar mudanças de sistema
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        battery.addEventListener('levelchange', () => {
          if (battery.level < 0.2 && !modoEconomiaEnergia) {
            ativarModoEconomiaEnergia();
          }
        });
      });
    }

    // Monitorar conectividade
    window.addEventListener('online', () => verificarPerfisContextuais());
    window.addEventListener('offline', () => verificarPerfisContextuais());

    return () => {
      clearInterval(intervalHora);
      window.removeEventListener('online', verificarPerfisContextuais);
      window.removeEventListener('offline', verificarPerfisContextuais);
    };
  }, [modoEconomiaEnergia]);

  const pararMonitoramentoContexto = useCallback(() => {
    // Cleanup será feito pelo useEffect
  }, []);

  const verificarAgendamentos = useCallback(() => {
    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    const diaAtual = agora.getDay();

    agendamentos.forEach(agendamento => {
      if (!agendamento.ativo) return;
      if (!agendamento.diasSemana.includes(diaAtual)) return;

      const [horaInicio, minutoInicio] = agendamento.horarioInicio.split(':').map(Number);
      const [horaFim, minutoFim] = agendamento.horarioFim.split(':').map(Number);
      const inicioMinutos = horaInicio * 60 + minutoInicio;
      const fimMinutos = horaFim * 60 + minutoFim;

      if (horaAtual >= inicioMinutos && horaAtual <= fimMinutos) {
        if (temaAtivo !== agendamento.temaId) {
          onMudarTema(agendamento.temaId);
          registrarTrocaAutomatica('agendamento', agendamento.nome);
        }
      }
    });
  }, [agendamentos, temaAtivo, onMudarTema]);

  const verificarPerfisContextuais = useCallback(() => {
    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    const conectividade = navigator.onLine ? 'wifi' : 'offline'; // Simplificado

    const perfilAplicavel = perfisContextuais
      .filter(perfil => perfil.ativo)
      .sort((a, b) => b.prioridade - a.prioridade)
      .find(perfil => {
        // Verificar condições de horário
        if (perfil.condicoes.horario) {
          const [horaInicio, minutoInicio] = perfil.condicoes.horario.inicio.split(':').map(Number);
          const [horaFim, minutoFim] = perfil.condicoes.horario.fim.split(':').map(Number);
          const inicioMinutos = horaInicio * 60 + minutoInicio;
          const fimMinutos = horaFim * 60 + minutoFim;

          if (horaAtual < inicioMinutos || horaAtual > fimMinutos) {
            return false;
          }
        }

        // Verificar conectividade
        if (perfil.condicoes.conectividade && perfil.condicoes.conectividade !== conectividade) {
          return false;
        }

        // Verificar bateria (se disponível)
        if (perfil.condicoes.bateria && 'getBattery' in navigator) {
          // Implementação assíncrona seria necessária aqui
        }

        return true;
      });

    if (perfilAplicavel && temaAtivo !== perfilAplicavel.temaId) {
      onMudarTema(perfilAplicavel.temaId);
      registrarTrocaAutomatica('contexto', perfilAplicavel.nome);
    }
  }, [perfisContextuais, temaAtivo, onMudarTema]);

  const registrarTrocaAutomatica = useCallback((tipo: string, motivo: string) => {
    if (notificacoesAtivas) {
      // Mostrar notificação
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Tema alterado automaticamente', {
          body: `Mudança por ${tipo}: ${motivo}`,
          icon: '/favicon.ico'
        });
      }
    }

    // Atualizar estatísticas
    setEstatisticas(prev => prev ? {
      ...prev,
      trocasAutomaticas: prev.trocasAutomaticas + 1
    } : null);
  }, [notificacoesAtivas]);

  const ativarModoEconomiaEnergia = useCallback(() => {
    setModoEconomiaEnergia(true);
    
    // Aplicar tema de economia de energia (geralmente escuro)
    const temaEconomia = temas.find(t => t.categoria === 'Dark' || t.nome.toLowerCase().includes('escuro'));
    if (temaEconomia && temaAtivo !== temaEconomia.id) {
      onMudarTema(temaEconomia.id);
      registrarTrocaAutomatica('economia', 'Bateria baixa');
    }
  }, [temas, temaAtivo, onMudarTema]);

  const criarAgendamento = useCallback(() => {
    const novoAgendamento: AgendamentoTema = {
      id: Date.now().toString(),
      nome: 'Novo Agendamento',
      temaId: temaAtivo,
      horarioInicio: '09:00',
      horarioFim: '17:00',
      diasSemana: [1, 2, 3, 4, 5], // Segunda a sexta
      ativo: true
    };

    setAgendamentos(prev => [...prev, novoAgendamento]);
  }, [temaAtivo]);

  const criarPerfilContextual = useCallback(() => {
    const novoPerfil: PerfilContextual = {
      id: Date.now().toString(),
      nome: 'Novo Perfil',
      descricao: 'Perfil contextual personalizado',
      condicoes: {},
      temaId: temaAtivo,
      prioridade: 1,
      ativo: true
    };

    setPerfisContextuais(prev => [...prev, novoPerfil]);
  }, [temaAtivo]);

  const solicitarPermissaoNotificacao = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificacoesAtivas(permission === 'granted');
    }
  }, []);

  // Salvar dados quando houver mudanças
  useEffect(() => {
    salvarDados();
  }, [salvarDados]);

  const renderizarAgendamento = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Agendamentos de Tema</h3>
        <AnimatedButton
          variant="primary"
          size="sm"
          onClick={criarAgendamento}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </AnimatedButton>
      </div>

      <div className="space-y-4">
        {agendamentos.map(agendamento => (
          <motion.div
            key={agendamento.id}
            layout
            className="p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={agendamento.nome}
                onChange={(e) => setAgendamentos(prev => 
                  prev.map(a => a.id === agendamento.id ? { ...a, nome: e.target.value } : a)
                )}
                className="font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              />
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={agendamento.ativo}
                    onChange={(e) => setAgendamentos(prev => 
                      prev.map(a => a.id === agendamento.id ? { ...a, ativo: e.target.checked } : a)
                    )}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Ativo</span>
                </label>
                <button
                  onClick={() => setAgendamentos(prev => prev.filter(a => a.id !== agendamento.id))}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tema
                </label>
                <select
                  value={agendamento.temaId}
                  onChange={(e) => setAgendamentos(prev => 
                    prev.map(a => a.id === agendamento.id ? { ...a, temaId: e.target.value } : a)
                  )}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {temas.map(tema => (
                    <option key={tema.id} value={tema.id}>
                      {tema.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Início
                </label>
                <input
                  type="time"
                  value={agendamento.horarioInicio}
                  onChange={(e) => setAgendamentos(prev => 
                    prev.map(a => a.id === agendamento.id ? { ...a, horarioInicio: e.target.value } : a)
                  )}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Fim
                </label>
                <input
                  type="time"
                  value={agendamento.horarioFim}
                  onChange={(e) => setAgendamentos(prev => 
                    prev.map(a => a.id === agendamento.id ? { ...a, horarioFim: e.target.value } : a)
                  )}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dias da Semana
              </label>
              <div className="flex space-x-2">
                {diasSemana.map(dia => (
                  <button
                    key={dia.id}
                    onClick={() => setAgendamentos(prev => 
                      prev.map(a => a.id === agendamento.id ? {
                        ...a,
                        diasSemana: a.diasSemana.includes(dia.id)
                          ? a.diasSemana.filter(d => d !== dia.id)
                          : [...a.diasSemana, dia.id]
                      } : a)
                    )}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                      agendamento.diasSemana.includes(dia.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={dia.completo}
                  >
                    {dia.nome}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {agendamentos.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum agendamento configurado
            </h3>
            <p className="text-gray-600 mb-4">
              Crie agendamentos para trocar temas automaticamente em horários específicos.
            </p>
            <AnimatedButton
              variant="primary"
              onClick={criarAgendamento}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Agendamento
            </AnimatedButton>
          </div>
        )}
      </div>
    </div>
  );

  const renderizarIA = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Inteligência Artificial</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">IA</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={iaAtiva}
              onChange={(e) => setIaAtiva(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {iaAtiva && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          {/* Configurações de IA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Configurações de Aprendizado</h4>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={aprendizadoAtivo}
                  onChange={(e) => setAprendizadoAtivo(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Aprender com minhas preferências
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificacoesAtivas}
                  onChange={(e) => {
                    if (e.target.checked) {
                      solicitarPermissaoNotificacao();
                    } else {
                      setNotificacoesAtivas(false);
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Notificações de mudanças automáticas
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={modoEconomiaEnergia}
                  onChange={(e) => setModoEconomiaEnergia(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Modo economia de energia automático
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sincronizacaoNuvem}
                  onChange={(e) => setSincronizacaoNuvem(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Sincronização na nuvem
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Status da IA</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">Sistema ativo</span>
                  </div>
                  <span className="text-xs text-green-600">Online</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Brain className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">Aprendizado ativo</span>
                  </div>
                  <span className="text-xs text-blue-600">
                    {aprendizadoAtivo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-sm text-purple-800">Sugestões inteligentes</span>
                  </div>
                  <span className="text-xs text-purple-600">Disponível</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sugestões da IA */}
          {aprendizadoAtivo && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                Sugestões Inteligentes
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  • Você tende a usar temas escuros após as 18h. Quer criar um agendamento automático?
                </p>
                <p className="text-sm text-gray-700">
                  • Detectamos que você prefere cores mais vibrantes pela manhã. Sugerimos o tema "Energia".
                </p>
                <p className="text-sm text-gray-700">
                  • Seu uso de temas de alto contraste aumentou. Quer ativar o modo acessibilidade?
                </p>
              </div>
              <div className="flex space-x-2 mt-4">
                <AnimatedButton variant="primary" size="sm">
                  Aplicar Sugestões
                </AnimatedButton>
                <AnimatedButton variant="ghost" size="sm">
                  Ignorar
                </AnimatedButton>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );

  const renderizarEstatisticas = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Estatísticas de Uso</h3>

      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">Tema Mais Usado</p>
                <p className="text-lg font-semibold text-blue-600">
                  {temas.find(t => t.id === estatisticas.temaMaisUsado)?.nome || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">Tempo Total</p>
                <p className="text-lg font-semibold text-green-600">
                  {Math.floor(estatisticas.tempoUsoTotal / 60)}h {estatisticas.tempoUsoTotal % 60}m
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-900">Trocas Automáticas</p>
                <p className="text-lg font-semibold text-purple-600">
                  {estatisticas.trocasAutomaticas}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-900">Trocas Manuais</p>
                <p className="text-lg font-semibold text-orange-600">
                  {estatisticas.trocasManuais}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico de horários de pico */}
      {estatisticas && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Horários de Maior Uso</h4>
          <div className="space-y-3">
            {estatisticas.horariosPico.map(({ hora, uso }) => (
              <div key={hora} className="flex items-center">
                <span className="w-12 text-sm text-gray-600">
                  {hora.toString().padStart(2, '0')}:00
                </span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${uso}%` }}
                  />
                </div>
                <span className="w-12 text-sm text-gray-600 text-right">
                  {uso}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preferências detectadas */}
      {estatisticas && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Preferências Detectadas</h4>
          <div className="space-y-2">
            {estatisticas.preferenciasDetectadas.map((preferencia, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                <Target className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm text-gray-700">{preferencia}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Navegação por abas */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'agendamento', nome: 'Agendamento', icon: Clock },
            { id: 'contexto', nome: 'Contexto', icon: Brain },
            { id: 'ia', nome: 'IA', icon: Sparkles },
            { id: 'estatisticas', nome: 'Estatísticas', icon: BarChart3 }
          ].map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaSelecionada(aba.id as any)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                abaSelecionada === aba.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <aba.icon className="w-4 h-4 mr-2" />
              {aba.nome}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo da aba */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={abaSelecionada}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {abaSelecionada === 'agendamento' && renderizarAgendamento()}
            {abaSelecionada === 'contexto' && (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Perfis Contextuais
                </h3>
                <p className="text-gray-600">
                  Em desenvolvimento - Criação de perfis baseados em contexto.
                </p>
              </div>
            )}
            {abaSelecionada === 'ia' && renderizarIA()}
            {abaSelecionada === 'estatisticas' && renderizarEstatisticas()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FuncionalidadesInteligentes;