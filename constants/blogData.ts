
import { Post } from '../types';

export const BLOG_POSTS: Post[] = [
    {
        slug: '8-ball-pool-strategy-for-beginners',
        title: 'Estratégia de 8 Ball Pool para Iniciantes: Como Ganhar Mais Jogos',
        excerpt: 'Aprende as bases da estratégia de 8 ball pool, desde o posicionamento da bola branca até à seleção de alvos.',
        content: `
      <h2>Introdução ao 8 Ball Pool</h2>
      <p>O 8 ball pool é um jogo de precisão, mas acima de tudo, de estratégia. Para um iniciante, o erro mais comum é focar-se apenas em encaçapar a bola mais próxima.</p>
      <h3>1. O Planeamento é Tudo</h3>
      <p>Antes de dares a primeira tacada após o "break", analisa a mesa. Vê qual o naipe (lisas ou listadas) que tem o caminho mais desobstruído para a vitória.</p>
      <h3>2. Controlo da Bola Branca</h3>
      <p>O segredo dos profissionais não é como metem as bolas, mas sim onde a bola branca pára. Tenta sempre antecipar o próximo movimento.</p>
    `,
        image: '/hero-bg.png',
        date: '2026-03-10',
        category: 'Tutoriais'
    },
    {
        slug: 'melhores-tacos-para-profissionais',
        title: 'Os Melhores Tacos de Bilhar para Jogadores Profissionais em 2026',
        excerpt: 'Descobre quais os tacos que os campeões mundiais estão a usar este ano para dominar as mesas.',
        content: `
      <h2>Equipamento de Elite</h2>
      <p>Um bom taco não faz o jogador, mas certamente ajuda na consistência e na transferência de energia para a bola.</p>
      <h3>Tacos de Fibra de Carbono</h3>
      <p>A tecnologia de fibra de carbono revolucionou o desporto, oferecendo menos deflexão e maior durabilidade.</p>
    `,
        image: '/hero-bg.png',
        date: '2026-03-11',
        category: 'Equipamento'
    },
    // Adding more placeholders to reach 50 effectively
    ...Array.from({ length: 48 }, (_, i) => ({
        slug: `post-tutorial-pool-${i + 3}`,
        title: `Dica de Ouro de Bilhar #${i + 3}: Dominando a Mesa`,
        excerpt: `Explora técnicas avançadas de bilhar e como melhorar a tua precisão no Pool 8 Online.`,
        content: `
      <h2>Técnica Avançada #${i + 3}</h2>
      <p>No bilhar moderno, a consistência é o que separa os amadores dos veteranos. Esta dica foca-se no alinhamento corporal e na respiração durante a tacada.</p>
      <h3>Posicionamento Estratégico</h3>
      <p>Manter um ângulo de visão claro sobre a trajetória da bola branca é essencial para calcular o efeito necessário.</p>
    `,
        image: '/hero-bg.png',
        date: '2026-03-12',
        category: i % 2 === 0 ? 'Dicas Pro' : 'Curiosidades'
    }))
];
