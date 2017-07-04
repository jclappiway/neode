import Create from './Services/Create';
import MergeOn from './Services/MergeOn';
import DeleteAll from './Services/DeleteAll';
import Builder from './Query/Builder';

import Node from './Node';

export default class Queryable {

    /**
     * Create a new instance of this Model
     *
     * @param  {object} properties
     * @return {Promise}
     */
    create(properties) {
        return Create(this._neode, this, properties)
            .then(node => {
                return new Node(this._neode, this, node);
            });
    }

    /**
     * Merge a node based on the defined indexes
     *
     * @param  {Object} properties
     * @return {Promise}
     */
    merge(properties) {
        const merge_on = this.mergeFields();

        return MergeOn(this._neode, this, merge_on, properties)
            .then(node => {
                return new Node(this._neode, this, node);
            });
    }

    /**
     * Merge a node based on the supplied properties
     *
     * @param  {Object} match Specific properties to merge on
     * @param  {Object} set   Properties to set
     * @return {Promise}
     */
    mergeOn(match, set) {
        const merge_on = Object.keys(match);
        const properties = Object.assign({}, match, set);

        return MergeOn(this._neode, this, merge_on, properties)
            .then(node => {
                return new Node(this._neode, this, node);
            });
    }

    /**
     * Delete all nodes for this model
     *
     * @return {Promise}
     */
    deleteAll() {
        return DeleteAll(this._neode, this);
    }

    /**
     * Find a Node by its Primary Key
     *
     * @param  {mixed} id
     * @return {Promise}
     */
    find(id) {
        const primary_key = this.primaryKey();

        return this.first(primary_key, id);
    }

    /**
     * Find a Node by it's internal node ID
     *
     * @param  {String} model
     * @param  {int}    id
     * @return {Promise}
     */
    findById(id) {
        return (new Builder(this._neode))
            .match('this', this)
            .whereId('this', id)
            .return('this')
            .limit(1)
            .execute()
            .then(res => {
                const node = res.records[0].get('this');

                return new Node(this._neode, this, node);
            });
    }

    /**
     * Find a Node by properties
     *
     * @param  {String} label
     * @param  {mixed}  key     Either a string for the property name or an object of values
     * @param  {mixed}  value   Value
     * @return {Promise}
     */
    first(key, value) {
        const alias = 'this';
        const builder = new Builder(this._neode);

        builder.match(alias, this);

        if (typeof key == 'object') {
            Object.keys(key).map(property => {
                builder.where(`${alias}.${property}`, key[ property ]);
            });
        }
        else {
            builder.where(`${alias}.${key}`, value);
        }

        return builder.return(alias)
            .limit(1)
            .execute()
            .then(res => {
                const node = res.records[0].get(alias);

                return new Node(this._neode, this, node);
            });
    }



}