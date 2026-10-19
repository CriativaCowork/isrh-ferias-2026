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
    version: '1.3.0',
    date: '16 Outubro 2026',
    features: [
      'Paginação em todos os PDFs gerados (Página X de Y)',
      'Nome e NIF da organização no rodapé dos PDFs',
      'Cabeçalho e subtítulo personalizáveis por página',
      'Cabeçalho e subtítulo padrão configuráveis nas Configurações',
      'Componente PdfHeaderConfig reutilizável para personalização rápida',
      'Coluna de ordem numérica no PDF do Mapa de Férias',
      'Filtros de ordenação no Mapa de Férias: alfabética, por departamento, departamento exclusivo',
      'Exportação do Mapa de Férias em Excel (xlsx) com filtros',
      'Responsividade melhorada no Mapa de Férias para tablets e mobiles',
      'Colunas fixas (Nº e Nome) com z-index adequado no Mapa de Férias',
    ],
    pages: [
      'Mapa de Férias (filtros, Excel, responsividade, coluna numérica)',
      'Configurações (dados da organização, cabeçalho padrão PDF)',
      'Dashboard (cabeçalho personalizável)',
      'Colaboradores (cabeçalho personalizável)',
      'Ausências (cabeçalho personalizável)',
      'Conformidade (cabeçalho personalizável)',
    ],
    css: [
      'Mapa de Férias: Colunas fixas com z-index (Nº e Nome)',
      'Mapa de Férias: Responsividade para tablets e mobiles',
      'Mapa de Férias: Filtros de ordenação e departamento exclusivo',
      'Configurações: Secção de dados da organização',
      'Configurações: Secção de cabeçalho padrão dos PDFs',
      'PdfHeaderConfig: Componente reutilizável com modal',
      'PDFs: Paginação com numeração de páginas',
      'PDFs: Rodapé com nome e NIF da organização',
    ],
    notes: [
      'Paginação: todos os PDFs agora mostram "Página X de Y"',
      'Organização: nome e NIF aparecem no rodapé quando definidos',
      'Cabeçalhos: personalizáveis por página ou padrão global',
      'Mapa de Férias: coluna numérica para ordenação visual',
      'Filtros: ordenação alfabética, por departamento (agrupado), departamento exclusivo',
      'Excel: exportação com todos os filtros aplicados',
      'Responsividade: colunas fixas não são ocultadas pelo menu em ecrãs pequenos',
    ],
  },
  {
    version: '1.2.1',
    date: '16 Outubro 2026',
    features: [
      'Menu lateral com 3 estados: expandido, recolhido e fechado',
      'Expansão automática do menu por hover quando recolhido',
      'Recolha automática ao retirar o cursor do menu',
      'Admin movido do rodapé do menu para o header (canto superior direito)',
      'Dropdown do perfil do admin com atalhos para Configurações e Versão',
      'Remoção do switch multilíngue — sistema agora apenas em Português',
      'Botão "Repor Dados de Exemplo" nas Configurações',
      'Popup de confirmação ao eliminar colaboradores',
      'Popup de confirmação ao eliminar ausências',
      'Popup de confirmação ao eliminar departamentos',
      'Popup de confirmação ao eliminar cargos',
      'Componente ConfirmDialog reutilizável com variantes (danger/warning/info)',
      'Correção do alinhamento dos ícones no menu recolhido',
      'Remoção da scrollbar do menu lateral em todos os browsers',
    ],
    pages: [
      'Layout (componente principal)',
      'Configurações (adicionado botão de reset)',
    ],
    css: [
      'Layout: Menu lateral com 3 estados e transições suaves',
      'Layout: Header com perfil do admin e dropdown',
      'Layout: Scrollbar oculta no sidebar (cross-browser)',
      'Layout: Alinhamento centrado dos ícones no menu recolhido',
      'Layout: Expansão automática por hover com delay anti-flickering',
      'Configurações: Botão de reset com ícone e confirmação',
      'ConfirmDialog: Componente reutilizável com 3 variantes visuais',
    ],
    notes: [
      'Menu recolhido: ícones perfeitamente centrados (w-full no container interno)',
      'Menu expandido por hover: transição suave com delay de 150ms',
      'Admin no header: avatar com gradiente + dropdown com informações completas',
      'Idioma único: Português (remoção de PT-AO, PT-PT e EN)',
      'Confirmações: todas as eliminações agora exigem confirmação explícita',
      'Reset de dados: repõe todos os dados para valores de exemplo',
    ],
  },
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
