function addEvent(b, d, c) {
    if (!c.$$guid) {
        c.$$guid = addEvent.guid++
    }
    if (!b.events) {
        b.events = {}
    }
    var a = b.events[d];
    if (!a) {
        a = b.events[d] = {};
        if (b["on" + d]) {
            a[0] = b["on" + d]
        }
    }
    a[c.$$guid] = c;
    b["on" + d] = handleEvent
}
addEvent.guid = 1;
function removeEvent(a, c, b) {
    if (a.events && a.events[c]) {
        delete a.events[c][b.$$guid]
    }
}
function handleEvent(d) {
    var c = true;
    d = d || fixEvent(window.event);
    var a = this.events[d.type];
    for (var b in a) {
        this.$$handleEvent = a[b];
        if (this.$$handleEvent(d) === false) {
            c = false
        }
    }
    return c
}
function fixEvent(a) {
    a.preventDefault = fixEvent.preventDefault;
    a.stopPropagation = fixEvent.stopPropagation;
    return a
}
fixEvent.preventDefault = function () {
    this.returnValue = false
};
fixEvent.stopPropagation = function () {
    this.cancelBubble = true
};
function createElement(a) {
    if (typeof document.createElementNS != "undefined") {
        return document.createElementNS("http://www.w3.org/1999/xhtml", a)
    }
    if (typeof document.createElement != "undefined") {
        return document.createElement(a)
    }
    return false
}
function getEventTarget(b) {
    var a;
    if (!b) {
        b = window.event
    }
    if (b.target) {
        a = b.target
    } else {
        if (b.srcElement) {
            a = b.srcElement
        }
    }
    if (a.nodeType == 3) {
        a = a.parentNode
    }
    return a
}
var css = {getElementsByClass:function (b, f, k) {
    var h = new Array();
    var d = b.getElementsByTagName(k);
    var a = d.length;
    var g = new RegExp("(^|\\s)" + f + "(\\s|$)");
    for (var e = 0, c = 0; e < a; e++) {
        if (this.elementHasClass(d[e], f)) {
            h[c] = d[e];
            c++
        }
    }
    return h
}, privateGetClassArray:function (a) {
    return a.className.split(" ")
}, privateCreateClassString:function (a) {
    return a.join(" ")
}, elementHasClass:function (a, c) {
    if (!a) {
        return false
    }
    var b = new RegExp("\\b" + c + "\\b");
    if (a.className.match(b)) {
        return true
    }
    return false
}, addClassToId:function (a, b) {
    this.addClassToElement(document.getElementById(a), b)
}, addClassToElement:function (b, c) {
    var a = this.privateGetClassArray(b);
    if (this.elementHasClass(b, c)) {
        return
    }
    a.push(c);
    b.className = this.privateCreateClassString(a)
}, removeClassFromId:function (a, b) {
    this.removeClassFromElement(document.getElementById(a), b)
}, removeClassFromElement:function (b, c) {
    var a = this.privateGetClassArray(b);
    for (x in a) {
        if (c == a[x]) {
            a[x] = "";
            break
        }
    }
    b.className = this.privateCreateClassString(a)
}};
var standardistaTableSorting = {that:false, isOdd:false, sortColumnIndex:-1, lastAssignedId:0, newRows:-1, lastSortedTable:-1, init:function () {
    if (!document.getElementsByTagName) {
        return
    }
    this.that = this;
    this.run()
}, run:function () {
    var c = document.getElementsByTagName("table");
    for (var b = 0; b < c.length; b++) {
        var a = c[b];
        if (css.elementHasClass(a, "sortable")) {
            this.makeSortable(a)
        }
    }
}, makeSortable:function (e) {
    if (!e.id) {
        e.id = "sortableTable" + this.lastAssignedId++
    }
    if (!e.tHead || !e.tHead.rows || 0 == e.tHead.rows.length) {
        return
    }
    var g = e.tHead.rows[e.tHead.rows.length - 1];
    for (var d = 0; d < g.cells.length; d++) {
        var c = createElement("a");
        c.href = "#";
        c.onclick = this.headingClicked;
        c.setAttribute("columnId", d);
        c.title = "Click to sort";
        var h = g.cells[d].childNodes;
        for (var b = 0; b < h.length; b++) {
            c.appendChild(h[b])
        }
        g.cells[d].appendChild(c);
        var a = createElement("span");
        a.className = "tableSortArrow";
        a.appendChild(document.createTextNode("\u00A0\u00A0"));
        g.cells[d].appendChild(a)
    }
    if (css.elementHasClass(e, "autostripe")) {
        this.isOdd = false;
        var f = e.tBodies[0].rows;
        for (var d = 0; d < f.length; d++) {
            this.doStripe(f[d])
        }
    }
}, headingClicked:function (k) {
    var i = standardistaTableSorting.that;
    var r = getEventTarget(k);
    var b = r.parentNode;
    var m = b.parentNode;
    var l = m.parentNode;
    var s = l.parentNode;
    if (!s.tBodies || s.tBodies[0].rows.length <= 1) {
        return false
    }
    var c = r.getAttribute("columnId") || b.cellIndex;
    var q = css.getElementsByClass(b, "tableSortArrow", "span");
    var d = "";
    if (q.length > 0) {
        d = q[0].getAttribute("sortOrder")
    }
    var n = "";
    var o = 0;
    while ("" == n && o < s.tBodies[0].rows.length) {
        n = i.getInnerText(s.tBodies[0].rows[o].cells[c]);
        o++
    }
    var p = i.determineSortFunction(n);
    if (s.id == i.lastSortedTable && c == i.sortColumnIndex) {
        h = i.newRows;
        h.reverse()
    } else {
        i.sortColumnIndex = c;
        var h = new Array();
        for (var f = 0; f < s.tBodies[0].rows.length; f++) {
            h[f] = s.tBodies[0].rows[f]
        }
        h.sort(p)
    }
    i.moveRows(s, h);
    i.newRows = h;
    i.lastSortedTable = s.id;
    var q = css.getElementsByClass(m, "tableSortArrow", "span");
    for (var f = 0; f < q.length; f++) {
        var a = q[f].parentNode;
        a.removeChild(q[f]);
        if (a != b) {
            g = createElement("span");
            g.className = "tableSortArrow";
            g.appendChild(document.createTextNode("\u00A0\u00A0"));
            a.appendChild(g)
        }
    }
    var g = createElement("span");
    g.className = "tableSortArrow";
    if (null == d || "" == d || "DESC" == d) {
        g.appendChild(document.createTextNode(" \u2191"));
        g.setAttribute("sortOrder", "ASC")
    } else {
        g.appendChild(document.createTextNode(" \u2193"));
        g.setAttribute("sortOrder", "DESC")
    }
    b.appendChild(g);
    return false
}, getInnerText:function (d) {
    if ("string" == typeof d || "undefined" == typeof d) {
        return d
    }
    if (d.innerText) {
        return d.innerText
    }
    var e = d.getAttribute("standardistaTableSortingInnerText");
    if (null != e && "" != e) {
        return e
    }
    e = "";
    var c = d.childNodes;
    var a = c.length;
    for (var b = 0; b < a; b++) {
        if (1 == c[b].nodeType) {
            e += this.getInnerText(c[b]);
            break
        } else {
            if (3 == c[b].nodeType) {
                e += c[b].nodeValue;
                break
            }
        }
    }
    d.setAttribute("standardistaTableSortingInnerText", e);
    return e
}, determineSortFunction:function (b) {
    var a = this.sortCaseInsensitive;
    if (b.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/)) {
        a = this.sortDate
    }
    if (b.match(/^\d\d[\/-]\d\d[\/-]\d\d$/)) {
        a = this.sortDate
    }
    if (b.match(/^[Ј$]/)) {
        a = this.sortCurrency
    }
    if (b.match(/^\d?\.?\d+$/)) {
        a = this.sortNumeric
    }
    if (b.match(/^[+-]?\d*\.?\d+([eE]-?\d+)?$/)) {
        a = this.sortNumeric
    }
    if (b.match(/^([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])$/)) {
        a = this.sortIP
    }
    return a
}, sortCaseInsensitive:function (d, c) {
    var e = standardistaTableSorting.that;
    var f = e.getInnerText(d.cells[e.sortColumnIndex]).toLowerCase();
    var g = e.getInnerText(c.cells[e.sortColumnIndex]).toLowerCase();
    if (f == g) {
        return 0
    } else {
        if (f < g) {
            return -1
        } else {
            return 1
        }
    }
}, sortDate:function (e, c) {
    var h = standardistaTableSorting.that;
    var i = h.getInnerText(e.cells[h.sortColumnIndex]);
    var j = h.getInnerText(c.cells[h.sortColumnIndex]);
    var f, d, g = -1;
    if (i.length == 10) {
        f = i.substr(6, 4) + i.substr(3, 2) + i.substr(0, 2)
    } else {
        g = i.substr(6, 2);
        if (parseInt(g) < 50) {
            g = "20" + g
        } else {
            g = "19" + g
        }
        f = g + i.substr(3, 2) + i.substr(0, 2)
    }
    if (j.length == 10) {
        d = j.substr(6, 4) + j.substr(3, 2) + j.substr(0, 2)
    } else {
        g = j.substr(6, 2);
        if (parseInt(g) < 50) {
            g = "20" + g
        } else {
            g = "19" + g
        }
        d = g + j.substr(3, 2) + j.substr(0, 2)
    }
    if (f == d) {
        return 0
    } else {
        if (f < d) {
            return -1
        }
    }
    return 1
}, sortCurrency:function (d, c) {
    var e = standardistaTableSorting.that;
    var f = e.getInnerText(d.cells[e.sortColumnIndex]).replace(/[^0-9.]/g, "");
    var g = e.getInnerText(c.cells[e.sortColumnIndex]).replace(/[^0-9.]/g, "");
    return parseFloat(f) - parseFloat(g)
}, sortNumeric:function (d, c) {
    var e = standardistaTableSorting.that;
    var f = parseFloat(e.getInnerText(d.cells[e.sortColumnIndex]));
    if (isNaN(f)) {
        f = 0
    }
    var g = parseFloat(e.getInnerText(c.cells[e.sortColumnIndex]));
    if (isNaN(g)) {
        g = 0
    }
    return f - g
}, makeStandardIPAddress:function (b) {
    var a = b.split(".");
    for (x in a) {
        b = a[x];
        while (3 > b.length) {
            b = "0" + b
        }
        a[x] = b
    }
    b = a.join(".");
    return b
}, sortIP:function (d, c) {
    var e = standardistaTableSorting.that;
    var f = e.makeStandardIPAddress(e.getInnerText(d.cells[e.sortColumnIndex]).toLowerCase());
    var g = e.makeStandardIPAddress(e.getInnerText(c.cells[e.sortColumnIndex]).toLowerCase());
    if (f == g) {
        return 0
    } else {
        if (f < g) {
            return -1
        } else {
            return 1
        }
    }
}, moveRows:function (d, b) {
    this.isOdd = false;
    for (var a = 0; a < b.length; a++) {
        var c = b[a];
        this.doStripe(c);
        d.tBodies[0].appendChild(c)
    }
}, doStripe:function (a) {
    if (this.isOdd) {
        css.addClassToElement(a, "odd")
    } else {
        css.removeClassFromElement(a, "odd")
    }
    this.isOdd = !this.isOdd
}};
function standardistaTableSortingInit() {
    standardistaTableSorting.init()
}
addEvent(window, "load", standardistaTableSortingInit);