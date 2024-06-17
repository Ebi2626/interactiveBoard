import { ErrorHandler, Injectable, inject } from "@angular/core";
import { SnackbarService } from "./services/snackbar.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    snackbarService = inject(SnackbarService);

    handleError(error: Error): void {
        this.snackbarService.showMessage(error.message);
    }
}