import Symbiote from '@symbiotejs/symbiote';
import { template } from './GoldStandardCard.tpl.js';
import { styles } from './GoldStandardCard.css.js';

/**
 * Showcase card component demonstrating Symbiote.js 3.x patterns.
 * Displays a content card with title, description, status badge, and action button.
 */
export class GoldStandardCard extends Symbiote {
  init$ = {
    title: 'Task Title',
    description: 'Task description goes here',
    status: 'active',
    statusLabel: 'Active',
    avatarUrl: '',
    avatarInitials: 'JD',
    onCardClick: () => {
      console.log('Card clicked:', this.$.title);
    },
    onAction: () => {
      this.$.status = this.$.status === 'active' ? 'completed' : 'active';
      this.$.statusLabel = this.$.status === 'active' ? 'Active' : 'Completed';
    },
  };
}

GoldStandardCard.template = template;
GoldStandardCard.rootStyles = styles;
GoldStandardCard.reg('gold-standard-card');
