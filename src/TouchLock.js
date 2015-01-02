/**
 * Created by KlimMalgin on 02.01.2015.
 */
'use strict';


var cancelScrollEvent = function (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    e.returnValue = false;
    return false;
};


var addTouchStartEventListener = function(elem, handler) {
    elem.addEventListener('touchstart', handler, false);
};

var removeTouchStartEventListener = function(elem, handler) {
    elem.removeEventListener('touchstart', handler, false);
};

var addTouchMoveEventListener = function(elem, handler) {
    elem.addEventListener('touchmove', handler, false);
};

var removeTouchMoveEventListener = function(elem, handler) {
    elem.removeEventListener('touchmove', handler, false);
};

var previousTouchEvent = null;

var deltaTouch = function(touchEvent, st) {
    if (previousTouchEvent) {
        var delta = -(touchEvent.touches[0].screenY - previousTouchEvent.touches[0].screenY);
        console.log('prev: %o | curr: %o | delta: %o | scrollTop: %o', previousTouchEvent, touchEvent, delta, st);
        previousTouchEvent = touchEvent;
        return delta;
    }
    previousTouchEvent = touchEvent;
    return 0;
};

var TouchLock = {

    componentDidMount: function () {
        this.touchLock();
    },

    componentDidUpdate: function () {
        this.touchLock();
    },

    componentWillUnmount: function () {
        this.touchRelease();
    },

    touchLock: function () {
        var elem = this.getDOMNode();
        if (elem) {
            addTouchMoveEventListener(elem, this.onTouchHandler);
            addTouchStartEventListener(elem, this.onTouchStartHandler);
        }
    },

    touchRelease: function () {
        var elem = this.getDOMNode();
        if (elem) {
            removeTouchMoveEventListener(elem, this.onTouchHandler);
            removeTouchStartEventListener(elem, this.onTouchStartHandler);
        }
    },

    onTouchStartHandler: function(e) {
        deltaTouch(e, this.getDOMNode().scrollTop);
    },

    onTouchHandler: function(e) {
        console.log('prev: ====================================');
        var elem = this.getDOMNode();
        var scrollTop = elem.scrollTop;
        var scrollHeight = elem.scrollHeight;
        var height = elem.clientHeight;
        var wheelDelta = deltaTouch(e, elem.scrollTop);
        var isDeltaPositive = wheelDelta > 0;

        if (isDeltaPositive && wheelDelta >= scrollHeight - height - scrollTop) {
            elem.scrollTop = scrollTop;
            console.log('%cprev: Cancel %o', 'color: green;', {
                isDeltaPositive: isDeltaPositive,
                wheelDelta: wheelDelta,
                scrollTop: scrollTop,
                shs: scrollHeight - height - scrollTop
            });
            return cancelScrollEvent(e);
        }
        else if (!isDeltaPositive && -wheelDelta >= scrollTop) {
            elem.scrollTop = 0;
            console.log('%cprev: Cancel %o', 'color: green;', {
                isDeltaPositive: isDeltaPositive,
                wheelDelta: wheelDelta,
                scrollTop: scrollTop,
                shs: scrollHeight - height - scrollTop
            });
            return cancelScrollEvent(e);
        }

        console.log('%cprev: Not canceled %o', 'color: red;', {
            isDeltaPositive: isDeltaPositive,
            wheelDelta: wheelDelta,
            scrollTop: scrollTop,
            shs: scrollHeight - height - scrollTop
        });

    }
};

module.exports = TouchLock;