import { ThemeToggle } from '../components/ThemeToggle';

export function Configuracoes() {
  return (
    <div className="page-container">
      <div className="card-mobile space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h1>

        {/* Tema */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Aparência
          </h2>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Tema</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Alterne entre modo claro e escuro
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Sobre */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sobre
          </h2>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-white">Jurus Mobile</strong>
              <br />
              Versão 2.0.0
              <br />
              Simulador de Investimentos Profissional
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
