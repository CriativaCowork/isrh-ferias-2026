export interface VersionEntry {
  version: string;
  date: string;
  features: string[];
  pages: string[];
  css: string[];
  notes: string[];
}

export const VERSION_HISTORY: VersionEntry[] = [
  {
    version: '1.2.0',
    date: '16 Outubro 2026',
    features: [
      'Sistema de versionamento automático',
      'Dashboard com KPIs em tempo real',
      'Mapa de Férias estilo Gantt com coluna fixa',
      'CRUD completo de Colaboradores com importação Excel',
      'Gestão de Ausências com tipos editáveis',
      'Conformidade Legal com alertas automáticos (Lei 12/23)',
      'Exportação PDF vetorial com rodapé institucional',
      'Partilha WhatsApp dupla (API + Clipboard)',
      'Modo escuro/claro',
      'Multilíngue (PT-AO, PT-PT, EN)',
      'Tutorial integrado por página',
      'Notificações visuais (zero alert do browser)',
      'Portal do Colaborador com auto-serviço',
      'Gestão de Substituições e plano de contingência',
    ],
    pages: [
      'Dashboard',
      'Mapa de Férias',
      'Colaboradores',
      'Ausências',
      'Conformidade',
      'Versionamento',
      'Portal do Colaborador',
      'Configurações',
    ],
    css: [
      'Dashboard: Glassmorphism + gráficos circulares configuráveis',
      'Mapa de Férias: Gantt Chart com cores por departamento',
      'Colaboradores: Cards + tabela com filtros avançados',
      'Ausências: Calendário visual com legenda de cores',
      'Conformidade: Cards de alertas com exportação individual',
      'Versionamento: Timeline com secções organizadas',
      'Portal: Interface limpa de auto-serviço',
      'Configurações: Formulários com validação visual',
    ],
    notes: [
      'Conformidade total com Lei Geral do Trabalho de Angola (Lei 12/23)',
      'Ano dinâmico — sem valores hardcoded',
      'Cores por departamento consistentes em todas as páginas',
    ],
  },
  {
    version: '1.1.0',
    date: '1 Setembro 2026',
    features: [
      'Gestão básica de colaboradores',
      'Calendário de férias simples',
      'Exportação PDF básica',
    ],
    pages: [
      'Dashboard (básico)',
      'Calendário',
      'Colaboradores (lista)',
    ],
    css: [
      'Layout base com sidebar',
      'Tabela de dados responsiva',
    ],
    notes: [
      'Versão inicial de testes internos',
    ],
  },
  {
    version: '1.0.0',
    date: '15 Julho 2026',
    features: [
      'Protótipo inicial',
      'Autenticação básica',
      'Visualização de calendário',
    ],
    pages: [
      'Login',
      'Calendário',
    ],
    css: [
      'Design system base',
    ],
    notes: [
      'Primeira versão do sistema',
    ],
  },
];

export function getCurrentVersion(): string {
  return VERSION_HISTORY[0].version;
}

export function getVersionDate(): string {
  return VERSION_HISTORY[0].date;
}
