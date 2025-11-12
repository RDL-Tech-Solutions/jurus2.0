import { useEffect, useMemo, useState } from 'react';
import { Plus, PiggyBank, CalendarRange, Bell, PauseCircle, PlayCircle, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { useMetasFinanceiras } from '../hooks/useMetasFinanceiras';
import { formatarMoeda } from '../utils/calculos';

const CATEGORIAS = [
  { value: 'aposentadoria', label: 'Aposentadoria', color: '#8b5cf6' },
  { value: 'casa', label: 'Casa', color: '#f59e0b' },
  { value: 'carro', label: 'Carro', color: '#10b981' },
  { value: 'viagem', label: 'Viagem', color: '#3b82f6' },
  { value: 'emergencia', label: 'Emergência', color: '#ef4444' },
  { value: 'educacao', label: 'Educação', color: '#6366f1' },
  { value: 'outro', label: 'Outro', color: '#64748b' }
];

const PRIORIDADES = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' }
];

export function Metas() {
  const {
    metas,
    notificacoesMetas,
    estatisticas,
    metasProximasVencimento,
    criarMeta,
    editarMeta,
    excluirMeta,
    adicionarContribuicao,
    alternarStatusMeta,
    calcularProgressoMeta,
    marcarNotificacaoLida,
    limparNotificacoesMetas,
    verificarNotificacoesPendentes
  } = useMetasFinanceiras();

  const [abrirForm, setAbrirForm] = useState(false);
  const [novo, setNovo] = useState({
    nome: '',
    valor: 10000,
    data: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: 'outro',
    prioridade: 'media',
    contribuicao: 0,
    descricao: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edicao, setEdicao] = useState({
    nome: '',
    valor: 0,
    data: '',
    contribuicao: 0,
    prioridade: 'media' as 'baixa' | 'media' | 'alta'
  });

  const [contribVal, setContribVal] = useState<Record<string, string>>({});
  const [contribDesc, setContribDesc] = useState<Record<string, string>>({});

  useEffect(() => {
    verificarNotificacoesPendentes();
  }, [metas, verificarNotificacoesPendentes]);

  const progressoGeral = useMemo(() => Math.min(Math.max((estatisticas?.progressoGeral as number) || 0, 0), 100), [estatisticas]);

  const handleCriar = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = CATEGORIAS.find(c => c.value === novo.categoria) || CATEGORIAS[CATEGORIAS.length - 1];
    const dataObj = new Date(novo.data + 'T00:00:00');
    criarMeta({
      nome: novo.nome || 'Nova Meta',
      descricao: novo.descricao || undefined,
      valorObjetivo: Number(novo.valor),
      valorMeta: Number(novo.valor),
      dataInicio: new Date(),
      dataObjetivo: dataObj,
      dataLimite: dataObj,
      categoria: cat.value as any,
      prioridade: novo.prioridade as any,
      cor: cat.color,
      contribuicaoMensal: Number(novo.contribuicao) || 0,
      notificacoes: { marcos: true, prazo: true, contribuicao: true }
    } as any);
    setAbrirForm(false);
    setNovo({ nome: '', valor: 10000, data: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), categoria: 'outro', prioridade: 'media', contribuicao: 0, descricao: '' });
  };

  const iniciarEdicao = (metaId: string) => {
    const meta = metas.find(m => m.id === metaId);
    if (!meta) return;
    setEditingId(metaId);
    setEdicao({
      nome: meta.nome,
      valor: (meta as any).valorMeta ?? (meta as any).valorObjetivo ?? 0,
      data: (meta as any).dataObjetivo ? new Date((meta as any).dataObjetivo).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      contribuicao: meta.contribuicaoMensal || 0,
      prioridade: meta.prioridade
    });
  };

  const salvarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const dataObj = new Date(edicao.data + 'T00:00:00');
    editarMeta(editingId, {
      nome: edicao.nome,
      valorMeta: Number(edicao.valor),
      valorObjetivo: Number(edicao.valor),
      dataObjetivo: dataObj,
      dataLimite: dataObj,
      contribuicaoMensal: Number(edicao.contribuicao) || 0,
      prioridade: edicao.prioridade
    } as any);
    setEditingId(null);
  };

  const cancelarEdicao = () => setEditingId(null);

  const handleContribuir = (metaId: string) => {
    const valor = parseFloat(contribVal[metaId] || '0');
    if (!valor || valor <= 0) return;
    adicionarContribuicao(metaId, valor, contribDesc[metaId]);
    setContribVal(prev => ({ ...prev, [metaId]: '' }));
    setContribDesc(prev => ({ ...prev, [metaId]: '' }));
  };

  return (
    <div className="page-container space-y-4">
      <div className="card-mobile">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PiggyBank className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metas Financeiras</h1>
          </div>
          <button className="btn btn-primary" onClick={() => setAbrirForm(v => !v)}>
            <Plus className="w-4 h-4 mr-2" /> Nova Meta
          </button>
        </div>
      </div>

      {abrirForm && (
        <div className="card-mobile">
          <form onSubmit={handleCriar} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
              <input value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} className="input-mobile" placeholder="Ex.: Fundo de Emergência" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor Objetivo</label>
              <input type="number" min={0} value={novo.valor} onChange={(e) => setNovo({ ...novo, valor: Number(e.target.value) })} className="input-mobile" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Objetivo</label>
              <input type="date" value={novo.data} onChange={(e) => setNovo({ ...novo, data: e.target.value })} className="input-mobile" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label>
              <select value={novo.categoria} onChange={(e) => setNovo({ ...novo, categoria: e.target.value })} className="input-mobile">
                {CATEGORIAS.map(c => (<option key={c.value} value={c.value}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prioridade</label>
              <select value={novo.prioridade} onChange={(e) => setNovo({ ...novo, prioridade: e.target.value as any })} className="input-mobile">
                {PRIORIDADES.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contribuição Mensal</label>
              <input type="number" min={0} value={novo.contribuicao} onChange={(e) => setNovo({ ...novo, contribuicao: Number(e.target.value) })} className="input-mobile" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
              <textarea value={novo.descricao} onChange={(e) => setNovo({ ...novo, descricao: e.target.value })} className="input-mobile" rows={2} />
            </div>
            <div className="md:col-span-3 flex items-center justify-end space-x-2">
              <button type="button" className="btn" onClick={() => setAbrirForm(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Salvar Meta</button>
            </div>
          </form>
        </div>
      )}

      <div className="card-mobile">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total de Metas</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{estatisticas.total}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Concluídas</p>
            <p className="text-xl font-semibold text-green-600 dark:text-green-400">{estatisticas.concluidas}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Em Andamento</p>
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">{estatisticas.emAndamento}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Progresso Geral</p>
            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded h-2">
              <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded" style={{ width: `${progressoGeral.toFixed(0)}%` }} />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{progressoGeral.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {metas.length === 0 ? (
        <div className="card-mobile text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">Nenhuma meta cadastrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {metas.map((meta) => {
            const progresso = calcularProgressoMeta(meta.id);
            const percent = progresso ? Math.min(Math.max(progresso.percentualConcluido, 0), 100) : 0;
            const valorMeta = (meta as any).valorMeta ?? (meta as any).valorObjetivo ?? 0;
            const diasRestantes = progresso?.diasRestantes ?? 0;
            const cat = CATEGORIAS.find(c => c.value === meta.categoria) || CATEGORIAS[CATEGORIAS.length - 1];
            const isPausada = meta.status === 'pausada';
            const isConcluida = meta.status === 'concluida' || percent >= 100;
            return (
              <div key={meta.id} className="card-mobile">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-10 rounded" style={{ backgroundColor: cat.color }} />
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        {meta.nome}
                        {isConcluida && <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" />}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatarMoeda(meta.valorAtual)} / {formatarMoeda(valorMeta)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {meta.prioridade}
                    </span>
                    <button className="btn" onClick={() => iniciarEdicao(meta.id)}>
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="btn" onClick={() => alternarStatusMeta(meta.id)}>
                      {isPausada ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                    </button>
                    <button className="btn" onClick={() => excluirMeta(meta.id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-2">
                    <div className="h-2 rounded" style={{ width: `${percent.toFixed(0)}%`, backgroundColor: cat.color }} />
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Progresso</p>
                      <p className="font-medium text-gray-900 dark:text-white">{percent.toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Restante</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatarMoeda(Math.max(valorMeta - meta.valorAtual, 0))}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Necessário/mês</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatarMoeda(progresso?.valorNecessarioMensal || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Prazo</p>
                      <p className="font-medium text-gray-900 dark:text-white flex items-center">
                        <CalendarRange className="w-4 h-4 mr-1" /> {diasRestantes} dias
                      </p>
                    </div>
                  </div>
                </div>

                {editingId === meta.id ? (
                  <form onSubmit={salvarEdicao} className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                      <input value={edicao.nome} onChange={(e) => setEdicao({ ...edicao, nome: e.target.value })} className="input-mobile" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor Objetivo</label>
                      <input type="number" min={0} value={edicao.valor} onChange={(e) => setEdicao({ ...edicao, valor: Number(e.target.value) })} className="input-mobile" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Objetivo</label>
                      <input type="date" value={edicao.data} onChange={(e) => setEdicao({ ...edicao, data: e.target.value })} className="input-mobile" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contribuição Mensal</label>
                      <input type="number" min={0} value={edicao.contribuicao} onChange={(e) => setEdicao({ ...edicao, contribuicao: Number(e.target.value) })} className="input-mobile" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prioridade</label>
                      <select value={edicao.prioridade} onChange={(e) => setEdicao({ ...edicao, prioridade: e.target.value as any })} className="input-mobile">
                        {PRIORIDADES.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))}
                      </select>
                    </div>
                    <div className="md:col-span-4 flex items-center justify-end space-x-2">
                      <button type="button" className="btn" onClick={cancelarEdicao}>Cancelar</button>
                      <button type="submit" className="btn btn-primary">Salvar</button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="number"
                          min={0}
                          placeholder="Valor da contribuição"
                          className="input-mobile"
                          value={contribVal[meta.id] || ''}
                          onChange={(e) => setContribVal(prev => ({ ...prev, [meta.id]: e.target.value }))}
                        />
                      </div>
                      <div>
                        <input
                          placeholder="Descrição (opcional)"
                          className="input-mobile"
                          value={contribDesc[meta.id] || ''}
                          onChange={(e) => setContribDesc(prev => ({ ...prev, [meta.id]: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center md:justify-end">
                      <button className="btn btn-primary w-full md:w-auto" onClick={() => handleContribuir(meta.id)}>Contribuir</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="card-mobile">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notificações</h2>
          </div>
          <div className="space-x-2">
            <button className="btn" onClick={() => verificarNotificacoesPendentes()}>Verificar</button>
            <button className="btn" onClick={limparNotificacoesMetas}>Limpar</button>
          </div>
        </div>
        {notificacoesMetas.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Sem notificações</p>
        ) : (
          <div className="space-y-2">
            {notificacoesMetas.map((n) => (
              <div key={n.id} className="flex items-start justify-between p-3 rounded border border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{n.titulo}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{n.mensagem}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(n.data).toLocaleString('pt-BR')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {!n.lida && (
                    <button className="btn" onClick={() => marcarNotificacaoLida(n.id)}>Marcar lida</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {metasProximasVencimento.length > 0 && (
        <div className="card-mobile">
          <div className="flex items-center space-x-2 mb-3">
            <CalendarRange className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Próximas do Vencimento</h2>
          </div>
          <div className="space-y-2">
            {metasProximasVencimento.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{m.nome}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Vence em {Math.ceil((new Date(m.dataLimite).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias</p>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{formatarMoeda(((m as any).valorMeta ?? (m as any).valorObjetivo) as number)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
