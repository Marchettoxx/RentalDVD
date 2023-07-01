import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {NgModule} from '@angular/core';
import {ApolloClientOptions, InMemoryCache} from '@apollo/client/core';

const uri = 'http://localhost:4000/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
    return {
        link: httpLink.create({uri}),
        cache: new InMemoryCache(),
        /*
        `watchQuery` è una delle opzioni di configurazione nel contesto di Apollo Client,
        una libreria JavaScript per la gestione dello stato dei dati e la gestione delle richieste GraphQL.
        Questa opzione viene utilizzata per configurare il comportamento di una query quando
        viene "osservata" o "monitorata" per i cambiamenti.
        Quando si utilizza `watchQuery` con l'opzione `fetchPolicy` impostata su 'network-only',
        si sta specificando che la query dovrebbe essere sempre eseguita come una richiesta di rete.
        Ciò significa che Apollo Client andrà direttamente al server GraphQL per ottenere i dati ogni
        volta che la query viene monitorata o si verifica un cambiamento.
        Questa opzione è utile quando si desidera ottenere sempre i dati più aggiornati dal server e
        non si desidera fare affidamento sulla memorizzazione nella cache locale di Apollo Client.
         È particolarmente utile in situazioni in cui è necessario garantire che i dati siano sempre
         freschi, ad esempio durante l'aggiornamento in tempo reale dei dati o in scenari in cui i dati
         possono essere modificati da altre parti dell'applicazione o da altri utenti.
        In sintesi, `watchQuery` con `fetchPolicy: 'network-only'` viene utilizzato per eseguire una
        query come richiesta di rete ogni volta che viene monitorata o si verifica un cambiamento,
        assicurando che i dati siano sempre aggiornati.
         */
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'network-only',
            },
        }
    };
}

@NgModule({
    exports: [ApolloModule],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        },
    ],
})
export class GraphQLModule {
}
