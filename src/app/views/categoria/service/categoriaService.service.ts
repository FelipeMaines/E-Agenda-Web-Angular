import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { FormCategoriaViewModel } from "../model/forms-categoria.view-model";
import { ListarCategoriaViewModel } from "../model/listar-categoria.view-model";
import { LocalStorageService } from "src/app/core/auth/services/local-storage.service";

@Injectable()

export class CategoriaService {

    private endpoint: string =
        'https://e-agenda-web-api.onrender.com/api/categorias/';

    constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

    processarErroHttp(err: HttpErrorResponse) {
        let msgErro = '';

        if (err.status == 0)
            msgErro = "Ocorreu um erro ao processar a requisicao";
        else if (err.status == 401)
            msgErro = "O usuario nao esta autorizado! Efetue login e tente novamente";

        else
            msgErro = err.error?.erros[0];

        return throwError(() => new Error(msgErro));
    }

    public selecionarTodos(): Observable<ListarCategoriaViewModel[]> {
        return this.http.get<any>(this.endpoint).pipe(
            map(res => res.dados),
            catchError(err => this.processarErroHttp(err))
        )
    }

    public selecionarPorId(id: string): Observable<FormCategoriaViewModel> {
        console.log('entrei servico selecionar')
        console.log(id);
        return this.http.get<any>(this.endpoint + id).pipe(
            map(res => res.dados),
            catchError(err => this.processarErroHttp(err))
        )
    }

    public inserir(categoria: FormCategoriaViewModel): Observable<FormCategoriaViewModel> {
        return this.http.post<any>(this.endpoint, categoria).pipe(
            map(res => res.dados),
            catchError(err => this.processarErroHttp(err))
        )
    }

    public editar(categoria: FormCategoriaViewModel, id: string) {
        console.log('entrei servico editar')
        console.log(categoria);
        console.log(id);

        return this.http.put<any>(this.endpoint + id, categoria).pipe(
            map(res => res.dados),
            catchError(err => this.processarErroHttp(err))
        )
    }

    public excluir(id: string): Observable<any> {
        return this.http.delete(this.endpoint + id)
          .pipe(
            catchError((err: HttpErrorResponse) => this.processarErroHttp(err))
          );
      }
}