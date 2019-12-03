import Builder, {mode} from '../Query/Builder';
import { eagerNode, } from '../Query/EagerUtils';

export default function FindByIds(neode, model, ids) {
    const alias = 'this';

    const builder = new Builder(neode);

    return builder.match(alias, model)
        .whereRaw(`ID(${alias}) IN [${ids.join(',')}]`)
        .return( eagerNode(neode, 1, alias, model) )
        .execute(mode.READ)
        .then(res => neode.hydrate(res, alias, model));
}
