import Builder, {mode} from '../Query/Builder';
import { eagerNode, } from '../Query/EagerUtils';

export default function FindAll(neode, model, properties, order, limit, skip) {
    const alias = 'this';

    const builder = new Builder(neode);

    // Match
    builder.match(alias, model);

    // Where
    if (properties) {
        Object.keys(properties).forEach(key => {
            if (typeof properties[key] === 'string') {
                builder.where(`${alias}.${key}`, properties[ key ]);
            } else if (typeof properties[key] === 'object') {
                // for example: WHERE key IN [keys] :
                Object.keys(properties[key]).forEach(function (operator) {
                    builder.whereRaw(`${alias}.${key} ${operator} [${properties[key][operator].map( p => '"'+p+'"').join(',')}]`);
                });
            }
        });
    }

    // Order
    if (typeof order == 'string') {
        builder.orderBy(`${alias}.${order}`);
    }
    else if (typeof order == 'object') {
        Object.keys(order).forEach(key => {
            builder.orderBy(`${alias}.${key}`, order[ key ]);
        });
    }

    // Output
    const output = eagerNode(neode, 1, alias, model);

    return builder.return(output)
        .limit(limit)
        .skip(skip)
        .execute(mode.READ)
        .then(res => neode.hydrate(res, alias));
}
