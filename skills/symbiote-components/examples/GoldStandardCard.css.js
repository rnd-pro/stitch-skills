import { css } from '@symbiotejs/symbiote';

export const styles = css`
  gold-standard-card {
    display: block;
    padding: var(--spacing-md);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    transition: box-shadow var(--transition-fast);
    cursor: pointer;

    &:hover {
      box-shadow: var(--shadow-md);
    }

    & header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--spacing-sm);
    }

    & h3 {
      margin: 0;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      line-height: var(--line-height-tight);
    }

    & span {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    & footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-block-start: var(--spacing-md);
      padding-block-start: var(--spacing-sm);
      border-block-start: 1px solid var(--color-border);
    }

    & img {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-full);
      object-fit: cover;
    }

    & button {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-inverse);
      background: var(--color-primary);
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background var(--transition-fast);

      &:hover {
        background: var(--color-primary-hover);
      }
    }

    &[hidden] {
      display: none !important;
    }
  }

  status-badge {
    display: inline-block;
    padding: 2px var(--spacing-sm);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-full);
    white-space: nowrap;

    &[data-status='active'] {
      color: var(--color-accent);
      background: var(--color-primary-light);
    }

    &[data-status='completed'] {
      color: var(--color-success);
      background: #d1fae5;
    }

    &[data-status='blocked'] {
      color: var(--color-error);
      background: #fee2e2;
    }
  }
`;
