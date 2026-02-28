import { html } from '@symbiotejs/symbiote';

export const template = html`
  <header>
    <div ${{ onclick: 'onCardClick' }}>
      <h3>{{title}}</h3>
      <span ${{ textContent: 'description' }}></span>
    </div>
    <status-badge ${{
    '@data-status': 'status',
    textContent: 'statusLabel',
  }}></status-badge>
  </header>
  <footer>
    <div>
      <span ${{
    textContent: 'avatarInitials',
    '@hidden': '!!avatarUrl',
  }}></span>
      <img ${{
    '@src': 'avatarUrl',
    '@hidden': '!avatarUrl',
  }}>
    </div>
    <button ${{ onclick: 'onAction' }}>Toggle Status</button>
  </footer>
`;
