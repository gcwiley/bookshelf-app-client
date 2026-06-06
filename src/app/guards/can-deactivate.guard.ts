import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

// rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// angular material
import { MatDialog } from '@angular/material/dialog';

// confirm dialog
import { ConfirmDialog } from '../components/confirm-dialog/confirm-dialog';

export interface CanComponentDeactivate {
  canDeactivate?: () => Observable<boolean> | Promise<boolean> | boolean;
  hasUnsavedChanges?: () => boolean;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
) => {
  const dialog = inject(MatDialog); // Injected at the top

  // 1. If no unsaved changes, allow navigation immediately
  if (component.hasUnsavedChanges && !component.hasUnsavedChanges()) {
    return true;
  }

  // 2. If the component defines its own custom deactivation logic, use that
  if (component.canDeactivate) {
    return component.canDeactivate();
  }

  // 3. Fallback: Show the generic confirmation dialog
  return dialog
    .open(ConfirmDialog, {
      data: {
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to leave?',
        confirmLabel: 'Leave',
        cancelLabel: 'Stay',
      },
    })
    .afterClosed()
    .pipe(map((confirmed) => confirmed ?? false));
};
