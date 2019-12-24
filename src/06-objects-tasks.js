/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  function constructor() {}
  constructor.prototype = proto;
  const obj = JSON.parse(json);
  const res = new constructor();
  return Object.assign(res, obj);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  total: '',
  prev: '',
  elOc: false,
  idOc: false,
  pElOc: false,
  erAlrOc: Error('Element, id and pseudo-element should not occur more then one time inside the selector'),
  erWOrd: Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'),

  element(value) {
    const {
      elOc, erAlrOc, erWOrd, prev,
    } = this;
    if (elOc) throw erAlrOc;
    if (prev !== '') throw erWOrd;
    return {
      ...this, prev: 'elem', elOc: true, total: `${this.total}${value}`,
    };
  },

  id(value) {
    const {
      idOc, erAlrOc, erWOrd, prev,
    } = this;
    if (idOc) throw erAlrOc;
    if (prev === 'class' || prev === 'pseudoElem') throw erWOrd;
    return {
      ...this, prev: 'id', idOc: true, total: `${this.total}#${value}`,
    };
  },

  class(value) {
    const { erWOrd, prev } = this;
    if (prev === 'attr') throw erWOrd;
    return { ...this, prev: 'class', total: `${this.total}.${value}` };
  },

  attr(value) {
    const { erWOrd, prev } = this;
    if (prev === 'pseudoClass') throw erWOrd;
    return { ...this, prev: 'attr', total: `${this.total}[${value}]` };
  },

  pseudoClass(value) {
    const { erWOrd, prev } = this;
    if (prev === 'pseudoElem') throw erWOrd;
    return { ...this, prev: 'pseudoClass', total: `${this.total}:${value}` };
  },

  pseudoElement(value) {
    const { pElOc, erAlrOc } = this;
    if (pElOc) throw erAlrOc;
    return {
      ...this, prev: 'pseudoElem', pElOc: true, total: `${this.total}::${value}`,
    };
  },

  combine(selector1, combinator, selector2) {
    return {
      ...this,
      total: `${selector1.total} ${combinator} ${selector2.total}`,
    };
  },

  stringify() {
    return this.total;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
