export { default } from './confirm-page-container.container';
export { default as ConfirmPageContainerHeader } from './confirm-page-container-header';
export { default as ConfirmDetailRow } from './confirm-detail-row';
export { default as ConfirmPageContainerNavigation } from './confirm-page-container-navigation';

export {
  default as ConfirmPageContainerContent,
  ConfirmPageContainerSummary,
} from './confirm-page-container-content';
///: BEGIN:ONLY_INCLUDE_IN(flask)
export { SnapInsight } from './flask/snap-insight.component';
///: END:ONLY_INCLUDE_IN
