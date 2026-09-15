import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Footer from '../components/Footer';

export default function Privacy() {
  const { t, i18n } = useTranslation();
  const isPt = i18n.language.startsWith('pt');

  return (
    <div className="w-full max-w-4xl p-4 sm:p-6 relative z-10 my-6">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center gap-2 mb-6">
        <Link
          to="/"
          data-testid="back-to-home-link"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-theme-border text-theme-secondary hover:text-theme-text hover:border-accent-pink/50 transition-colors text-sm font-medium shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>{t('back_to_home')}</span>
        </Link>

        <div className="flex items-center bg-surface rounded-lg border border-theme-border shadow-sm divide-x divide-theme-border/60">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Glass Panel */}
      <div className="glass-panel p-6 sm:p-10 shadow-2xl space-y-8 text-theme-text">
        <header className="border-b border-theme-border/60 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-accent-pink/10 text-accent-pink border border-accent-pink/20">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-orange via-accent-pink to-accent-purple">
                {t('privacy_title')}
              </h1>
              <p className="text-xs sm:text-sm text-theme-muted mt-1">
                {t('privacy_last_updated')}
              </p>
            </div>
          </div>
        </header>

        {isPt ? (
          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-theme-secondary">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-orange">1.</span> Compromisso com a Privacidade
              </h2>
              <p>
                A tua privacidade é fundamental. O <strong>TuneIn</strong> foi concebido segundo o princípio de minimização de dados: não exigimos registo de contas, passwords, nem recolhemos informações pessoais sensíveis.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-pink">2.</span> Dados Recolhidos
              </h2>
              <p>
                Apenas processamos as informações estritamente necessárias para a dinâmica das partidas em tempo real:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-theme-muted">
                <li><strong>Alcunha (Nickname):</strong> Nome público temporário que escolhes para jogar numa sala;</li>
                <li><strong>Avatar:</strong> Identificador visual gerado aleatoriamente ou selecionado;</li>
                <li><strong>Token de Sessão:</strong> Um identificador anónimo efémero para permitir reconexão suave caso recarregues a página durante o jogo.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-purple">3.</span> Armazenamento Local (localStorage)
              </h2>
              <p>
                Utilizamos o armazenamento local do teu navegador (localStorage) exclusivamente para guardar as tuas preferências de utilização:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-theme-muted">
                <li>O teu último nickname e avatar selecionados;</li>
                <li>A tua preferência de tema (Modo Claro / Modo Escuro / Sazonal);</li>
                <li>O idioma de interface selecionado (PT, EN, ES, FR).</li>
              </ul>
              <p className="text-xs text-theme-muted">
                Podes limpar estes dados a qualquer momento através das definições de histórico do teu navegador.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-orange">4.</span> Telemetria e Analytics
              </h2>
              <p>
                Utilizamos o serviço <em>Vercel Analytics</em> para recolher métricas agregadas e completamente anonimizadas de tráfego (como tempos de resposta e contagem de visualizações de página), sem qualquer recurso a cookies de rastreio publicitário.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-pink">5.</span> Retenção de Dados
              </h2>
              <p>
                Os dados das salas e das pontuações são voláteis e residem apenas na memória temporária do servidor enquanto decorre a partida. Assim que uma sala é encerrada ou fica vazia, todos os dados dessa sala são eliminados.
              </p>
            </section>

            <section className="space-y-2 border-t border-theme-border/60 pt-4">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <Mail size={18} className="text-accent-pink" /> Contacto
              </h2>
              <p>
                Para qualquer esclarecimento sobre a nossa política de privacidade, envia-nos um email para:{' '}
                <a 
                  href="mailto:curredev@gmail.com" 
                  className="font-medium text-accent-pink hover:underline"
                >
                  curredev@gmail.com
                </a>
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-theme-secondary">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-orange">1.</span> Privacy Commitment
              </h2>
              <p>
                Your privacy is essential. <strong>TuneIn</strong> is designed with data minimization in mind: no registration, passwords, or personal sensitive data is ever required or collected.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-pink">2.</span> Information We Process
              </h2>
              <p>
                We only process temporary information required to run the game rooms:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-theme-muted">
                <li><strong>Nickname:</strong> A temporary display name you select for the room;</li>
                <li><strong>Avatar:</strong> An avatar selected or generated for your player;</li>
                <li><strong>Session Token:</strong> An anonymous token used to restore your session if you refresh the browser during an active game.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-purple">3.</span> Local Storage
              </h2>
              <p>
                We use browser localStorage strictly to preserve your user preferences locally:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-theme-muted">
                <li>Your chosen nickname and avatar;</li>
                <li>Your theme preference (Light / Dark / Seasonal);</li>
                <li>Your selected language (PT, EN, ES, FR).</li>
              </ul>
              <p className="text-xs text-theme-muted">
                You can clear this storage at any time via your browser settings.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-orange">4.</span> Telemetry & Analytics
              </h2>
              <p>
                We use <em>Vercel Analytics</em> to monitor aggregate, privacy-friendly performance metrics (page views and loading speed) without tracking cookies or personal profile building.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-pink">5.</span> Data Retention
              </h2>
              <p>
                Room states and trivia scores reside only in transient server memory. Once a room closes or all players leave, the room state is destroyed.
              </p>
            </section>

            <section className="space-y-2 border-t border-theme-border/60 pt-4">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <Mail size={18} className="text-accent-pink" /> Contact
              </h2>
              <p>
                If you have questions regarding this Privacy Policy, please contact:{' '}
                <a 
                  href="mailto:curredev@gmail.com" 
                  className="font-medium text-accent-pink hover:underline"
                >
                  curredev@gmail.com
                </a>
              </p>
            </section>
          </div>
        )}
      </div>

      <Footer className="mt-8" />
    </div>
  );
}
