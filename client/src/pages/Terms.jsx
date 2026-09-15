import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShieldCheck, FileText, Music, AlertCircle, Mail } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Footer from '../components/Footer';

export default function Terms() {
  const { t, i18n } = useTranslation();
  const isPt = i18n.language.startsWith('pt');

  return (
    <div className="w-full max-w-4xl p-4 sm:p-6 relative z-10 my-6">
      {/* Top Bar: Voltar + Theme/Lang */}
      <div className="w-full flex justify-between items-center gap-2 mb-6">
        <Link
          to="/"
          data-testid="back-to-home-link"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-theme-border text-theme-secondary hover:text-theme-text hover:border-accent-purple/50 transition-colors text-sm font-medium shadow-sm"
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
            <div className="p-2.5 rounded-xl bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-orange via-accent-pink to-accent-purple">
                {t('terms_title')}
              </h1>
              <p className="text-xs sm:text-sm text-theme-muted mt-1">
                {t('terms_last_updated')}
              </p>
            </div>
          </div>
        </header>

        {isPt ? (
          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-theme-secondary">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-orange">1.</span> Aceitação dos Termos
              </h2>
              <p>
                Ao aceder e utilizar a plataforma <strong>TuneIn</strong>, concordas em ficar vinculado por estes Termos e Condições de Serviço. Se não concordares com qualquer parte destes termos, não deves utilizar a aplicação.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-orange">2.</span> Descrição do Serviço
              </h2>
              <p>
                O TuneIn é um jogo multijogador em tempo real gratuito, concebido para fins recreativos e de entretenimento, onde os participantes adivinham títulos e artistas musicais através de pequenas prévias sonoras.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-pink">3.</span> Conduta do Utilizador & Fair Play
              </h2>
              <p>
                Os jogadores comprometem-se a manter uma conduta respeitosa. É estritamente proibido:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-theme-muted">
                <li>Utilizar apelidos (nicknames) ou mensagens ofensivas, difamatórias ou discriminatórias;</li>
                <li>Explorar falhas, recorrer a automações não autorizadas (bots) ou prejudicar o normal funcionamento das salas;</li>
                <li>Fazer spam no chat de palpites ou sobrecarregar as comunicações da sala.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-purple">4.</span> Direitos de Autor e Música de Terceiros
              </h2>
              <p>
                O TuneIn não reivindica a propriedade de quaisquer faixas de áudio, nomes de artistas ou capas de álbuns reproduzidos durante o jogo. Todo o conteúdo musical e direitos de propriedade intelectual pertencem aos seus respetivos autores, editoras e distribuidores legais. As reproduções destinam-se exclusivamente a citação e identificação no contexto do jogo de perguntas e respostas.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-orange">5.</span> Isenção de Garantias e Limitação de Responsabilidade
              </h2>
              <p>
                O serviço é fornecido "como está" (as-is), sem garantias de qualquer tipo relativas a tempo de atividade ininterrupto, ausência de erros ou compatibilidade total com dispositivos específicos.
              </p>
            </section>

            <section className="space-y-2 border-t border-theme-border/60 pt-4">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <Mail size={18} className="text-accent-pink" /> Contacto
              </h2>
              <p>
                Se tiveres dúvidas, sugestões ou questões relativamente a estes Termos, contacta diretamente através de:{' '}
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
                <span className="text-accent-orange">1.</span> Acceptance of Terms
              </h2>
              <p>
                By accessing and using <strong>TuneIn</strong>, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-orange">2.</span> Description of Service
              </h2>
              <p>
                TuneIn is a free, real-time multiplayer music trivia web application built for entertainment purposes, allowing participants to compete by guessing songs and artists from audio samples.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-pink">3.</span> User Conduct & Fair Play
              </h2>
              <p>
                Players agree to act respectfully. The following behaviors are strictly prohibited:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-theme-muted">
                <li>Using offensive, defamatory, or discriminatory nicknames or messages;</li>
                <li>Exploiting bugs, using bots, or disrupting game rooms;</li>
                <li>Spamming the chat or flooding socket events.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-purple">4.</span> Intellectual Property & Third-Party Music
              </h2>
              <p>
                TuneIn does not claim ownership of any music tracks, artist names, or cover art played during games. All rights and intellectual property remain with their respective artists, record labels, and copyright holders. Samples are used solely for trivia and identification purposes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <span className="text-accent-orange">5.</span> Disclaimer of Warranties
              </h2>
              <p>
                TuneIn is provided on an "as-is" and "as-available" basis without any express or implied warranty regarding availability or uptime.
              </p>
            </section>

            <section className="space-y-2 border-t border-theme-border/60 pt-4">
              <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
                <Mail size={18} className="text-accent-pink" /> Contact
              </h2>
              <p>
                For questions, feedback, or inquiries regarding these Terms, please reach out directly to:{' '}
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
