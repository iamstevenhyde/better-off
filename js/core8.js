// core8.js -- shared helpers for Better Off: Open Deals (v8). No DOM access
// here on purpose (same discipline as v7's core.js): this file is required
// from Node by e2e_test8.js and loaded as a plain <script> by student.html /
// professor.html / projector.html, so every number and every deal-row shape
// agrees across all three pages and the test.
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BO8Core = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---- card order / seats (DESIGN-v8.md section 2: 17 firms, no separate
  // AI-firm cards this time -- AI companies are just the fixed fallback
  // prices, not seats). ----
  var SEAT_ORDER = [
    'G1', 'G2', 'G3', 'G4', 'G5', 'G6',
    'P1', 'P2', 'P3', 'P4', 'P5',
    'R1', 'R2', 'R3', 'R4', 'R5', 'R6'
  ];

  function cardIdForSeat(seatIndex) { return SEAT_ORDER[seatIndex]; }
  function seatForCardId(id) { return SEAT_ORDER.indexOf(id); }
  function tierOf(id) {
    if (!id) return null;
    if (id.charAt(0) === 'G') return 'grower';
    if (id.charAt(0) === 'P') return 'processor';
    return 'retailer';
  }

  // ---- art: reuse v7's art map for the 17 student cards (same ids, same
  // files; v8 has no AI-firm cards so those entries are simply unused). ----
  var ART_BASE = 'art/v5/mj/';
  var ART_MAP = {
    G1: ART_BASE + 'postcard_grower_2_0.png',
    G2: ART_BASE + 'postcard_grower_3_0.png',
    G3: ART_BASE + 'postcard_grower_4_0.png',
    G4: ART_BASE + 'postcard_grower_5_0.png',
    G5: ART_BASE + 'postcard_grower_6_0.png',
    G6: ART_BASE + 'postcard_grower_7_0.png',
    P1: ART_BASE + 'postcard_processor_2_0.png',
    P2: ART_BASE + 'postcard_processor_3_0.png',
    P3: ART_BASE + 'postcard_processor_4_0.png',
    P4: ART_BASE + 'postcard_processor_5_0.png',
    P5: ART_BASE + 'postcard_processor_2_1.png',
    R1: ART_BASE + 'postcard_retail_2_0.png',
    R2: ART_BASE + 'postcard_retail_3_0.png',
    R3: ART_BASE + 'postcard_retail_4_0.png',
    R4: ART_BASE + 'postcard_retail_5_0.png',
    R5: ART_BASE + 'postcard_retail_6_0.png',
    R6: ART_BASE + 'postcard_retail_7_0.png'
  };
  function artFor(id) { return ART_MAP[id] || ''; }

  // ---- join codes (same alphabet as v7, no I/O to avoid confusion) ----
  var CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  function genJoinCode(prefix) {
    var out = prefix || '';
    while (out.length < 5) {
      out += CODE_ALPHABET.charAt(Math.floor(Math.random() * CODE_ALPHABET.length));
    }
    return out.slice(0, 5);
  }

  // ---- formatting (all engine amounts are in $k, DESIGN-v8.md section 2) ----
  function money(n) {
    var neg = n < 0;
    var v = Math.round(Math.abs(n || 0));
    var s = '$' + v.toLocaleString() + 'k';
    return neg ? '-' + s : s;
  }
  function signedMoney(n) { return (n >= 0 ? '+' : '') + money(n); }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ---- supabase row helpers ----
  function fetchGameByCode(supa, code) {
    return supa.from('weed_games').select('*').eq('join_code', code).maybeSingle();
  }
  function fetchGameById(supa, id) {
    return supa.from('weed_games').select('*').eq('id', id).maybeSingle();
  }
  function fetchTeams(supa, gameId) {
    return supa.from('weed_teams').select('*').eq('game_id', gameId).order('seat_index', { ascending: true });
  }
  function fetchDeals(supa, gameId) {
    return supa.from('weed_deals').select('*').eq('game_id', gameId).order('created_at', { ascending: true });
  }
  function fetchDecisions(supa, gameId) {
    return supa.from('weed_decisions').select('*').eq('game_id', gameId).order('created_at', { ascending: true });
  }
  function insertDecision(supa, gameId, season, seatIndex, kind, payload) {
    return supa.from('weed_decisions').insert({
      game_id: gameId, season: season, seat_index: seatIndex, kind: kind, payload: payload || {}
    });
  }
  function subscribeTable(supa, channelName, table, filter, cb) {
    var ch = supa.channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: table, filter: filter }, cb)
      .subscribe();
    return ch;
  }

  // ---- a tiny FIFO queue: everything passed to enqueue() runs only after
  // the previous one's promise has settled (same as v7's core.js). ----
  function makeQueue() {
    var tail = Promise.resolve();
    return function enqueue(fn) {
      var result = tail.then(fn, fn);
      tail = result.then(function () {}, function () {});
      return result;
    };
  }

  // ---- fetch() with a hard timeout (same rationale as v7: a stalled fetch
  // on classroom wifi has no default timeout and would otherwise hang every
  // future queued action forever). ----
  function makeTimeoutFetch(ms) {
    ms = ms || 12000;
    return function timeoutFetch(url, options) {
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, ms);
      var opts = {};
      for (var k in options) { if (Object.prototype.hasOwnProperty.call(options, k)) opts[k] = options[k]; }
      opts.signal = controller.signal;
      return fetch(url, opts).then(
        function (r) { clearTimeout(timer); return r; },
        function (e) { clearTimeout(timer); throw e; }
      );
    };
  }

  // ---- world.rev compare-and-swap writer (only the professor page writes
  // world: DESIGN-v8.md section 11). Identical pattern to v7's core.js. ----
  function writeWorldCAS(supa, gameId, computeFn, maxRetries) {
    maxRetries = maxRetries == null ? 6 : maxRetries;
    function attempt(n) {
      return supa.from('weed_games').select('*').eq('id', gameId).single().then(function (res) {
        if (res.error) throw res.error;
        var game = res.data;
        return Promise.resolve(computeFn(game)).then(function (result) {
          if (!result) return game;
          var rev = (game.world && game.world.rev) || 0;
          var nextWorld = result.world;
          nextWorld.rev = rev + 1;
          var patch = { world: nextWorld };
          if (result.phase) patch.phase = result.phase;
          return supa.from('weed_games').update(patch).eq('id', gameId).eq('world->>rev', String(rev)).select()
            .then(function (res2) {
              if (res2.error) throw res2.error;
              if (res2.data && res2.data.length) return res2.data[0];
              if (n >= maxRetries) throw new Error('writeWorldCAS: too many conflicting writers for game ' + gameId);
              return attempt(n + 1);
            });
        });
      });
    }
    return attempt(0);
  }

  // ---- deal row shape (DESIGN-v8.md section 11). terms carries everything
  // engine-relevant plus bookkeeping (writer, confirmations, edited_by_prof).
  // `sliders` is the ROUND2-CONTRACT.md section A addition: {partner, qty,
  // price, penalty} when the deal was built with the slider composer; null
  // for the old plain-text path (professor fake-reader/bots still use that).
  function newDealTerms(writerId, parties, text, sliders) {
    return { v: 8, text: text, writer: writerId, parties: parties, sliders: sliders || null, reading: null, reader: null, question: null, confirmations: {}, edited_by_prof: false };
  }

  // ---- slider ranges (ROUND2-CONTRACT.md section A: "Slider ranges come
  // from market.json CONST.SLIDERS ... web reads them from the bundle, never
  // hard-codes"). No fallback -- the engine bundle is the one source of
  // truth; a caller gets null until the bundle is loaded and shows a loading
  // state (same pattern as other engine-dependent panels, e.g. orderOptions).
  function sliderRanges(engineModule) {
    return (engineModule && engineModule.CONST && engineModule.CONST.SLIDERS) || null;
  }

  // ---- student-facing status label/class for a deal still with the AI
  // (status written/reading): ROUND2-CONTRACT.md section C -- "AI is
  // reading..." while the reader's heartbeat is fresh, "Waiting for the AI
  // reader" when it's stale or missing, so a student isn't left staring at
  // "Reading..." forever with no idea the reader isn't running. Every other
  // status keeps the plain statusLabel/statusClass above.
  function statusLabelForStudent(d, heartbeatIsFresh) {
    if (d.status === 'written' || d.status === 'reading') {
      return heartbeatIsFresh ? 'AI is reading...' : 'Waiting for the AI reader';
    }
    return statusLabel(d);
  }
  function statusClassForStudent(d, heartbeatIsFresh) {
    if (d.status === 'written' || d.status === 'reading') {
      return heartbeatIsFresh ? 'wait' : 'warn';
    }
    return statusClass(d);
  }

  // A deal is "mine" if my firm id is in terms.parties (writer or any other party).
  function dealsForFirm(deals, firmId) {
    return deals.filter(function (d) { return (d.terms && d.terms.parties || []).indexOf(firmId) !== -1; });
  }

  // Every party OTHER than the writer must confirm, and the writer confirms
  // too (DESIGN-v8.md section 5: "the writer confirms too, because the AI
  // may have misread them").
  function confirmedBy(d) { return (d.terms && d.terms.confirmations) || {}; }
  function allPartiesConfirmed(d) {
    var parties = (d.terms && d.terms.parties) || [];
    var conf = confirmedBy(d);
    return parties.length > 0 && parties.every(function (p) { return !!conf[p]; });
  }
  function needsMyConfirmation(d, firmId) {
    if (d.status !== 'read') return false;
    var parties = (d.terms && d.terms.parties) || [];
    if (parties.indexOf(firmId) === -1) return false;
    return !confirmedBy(d)[firmId];
  }

  // ---- status chip label/class for a deal row, from the writer's or any
  // party's point of view (DESIGN-v8.md section 5 lifecycle). ----
  // 'withdrawn' (fix 6, 2026-10-06): the sender pulled the deal before both
  // sides confirmed it. weed_deals.status is plain text with no CHECK
  // constraint (schema-weed.sql), so this needed no migration -- the
  // reader/resolve/professor pending-deal filters all key on specific
  // statuses ('written'/'reading' for the reader, 'confirmed' for resolve),
  // so a withdrawn deal is already invisible to them without further code.
  var STATUS_LABEL = {
    written: 'Reading...', reading: 'Reading...', read: 'Confirm the reading',
    question: 'Question from the AI', confirmed: 'Signed', declined: 'Not agreed', voided: 'Voided by professor',
    countered: 'Countered', withdrawn: 'Withdrawn'
  };
  var STATUS_CLASS = {
    written: 'wait', reading: 'wait', read: 'warn', question: 'warn', confirmed: 'ok', declined: 'bad', voided: 'bad',
    countered: 'bad', withdrawn: 'bad'
  };
  function statusLabel(d) { return STATUS_LABEL[d.status] || d.status; }
  function statusClass(d) { return STATUS_CLASS[d.status] || 'wait'; }

  // How long a deal has been sitting in 'reading' (claimed by the reader but
  // not yet answered), in ms -- reader8 writes terms.reader.started_at on
  // claim. Returns null when that field isn't there yet (older rows, or
  // before reader8 ships it) so callers can skip the stuck-deal UI rather
  // than show a false reading from a missing timestamp.
  function readingElapsedMs(d) {
    var startedAt = d.terms && d.terms.reader && d.terms.reader.started_at;
    if (!startedAt || d.status !== 'reading') return null;
    return Date.now() - new Date(startedAt).getTime();
  }

  // ---- reader heartbeat freshness (DESIGN-v8.md section 10: green under 30s) ----
  function heartbeatFresh(decisions, withinMs) {
    withinMs = withinMs || 30000;
    var hbs = decisions.filter(function (d) { return d.kind === 'reader_heartbeat'; });
    if (!hbs.length) return false;
    var latest = hbs[hbs.length - 1];
    var at = (latest.payload && latest.payload.at) || latest.created_at;
    return (Date.now() - new Date(at).getTime()) < withinMs;
  }

  // ---- latest-per-seat decision lookup (DESIGN-v8.md section 11: "latest
  // per seat wins" for 'orders'; same rule applied here for 'ai_sale'). ----
  function latestPerSeat(decisions, kind) {
    var out = {};
    decisions.forEach(function (d) {
      if (d.kind !== kind) return;
      var prev = out[d.seat_index];
      if (!prev || new Date(d.created_at) >= new Date(prev.created_at)) out[d.seat_index] = d;
    });
    return out;
  }

  // ---- builds the BO8 engine `state` shape from raw Supabase rows
  // (DESIGN-v8.md section 10's reader and section 6/7's resolve both consume
  // this shape: {deals, orders, aiCropLocks, aiCovered}). `teams` maps
  // seat_index -> archetype (firm id) for the decisions tables, which key on
  // seat_index rather than firm id directly. ----
  function buildEngineState(deals, decisions, teams, world) {
    var seatToFirm = {};
    (teams || []).forEach(function (t) { seatToFirm[t.seat_index] = t.archetype; });

    var engineDeals = (deals || []).map(function (d) {
      return { id: d.id, status: d.status, reading: d.terms && d.terms.reading, parties: (d.terms && d.terms.parties) || [] };
    });

    var orders = {};
    var ordersBySeat = latestPerSeat(decisions, 'orders');
    Object.keys(ordersBySeat).forEach(function (seat) {
      var firmId = seatToFirm[seat];
      if (firmId) orders[firmId] = ordersBySeat[seat].payload;
    });

    // aiCropLocks: a grower has GROWER_CAPACITY crops (2) and can lock each
    // one in separately via its own "Sell one crop to the AI now" click, so
    // EVERY 'ai_sale' decision for a seat counts (not latest-per-seat like
    // 'orders') -- each row is one locked-in crop sale at the bid it showed
    // at that moment.
    var aiCropLocks = {};
    decisions.forEach(function (d) {
      if (d.kind !== 'ai_sale') return;
      var firmId = seatToFirm[d.seat_index];
      if (!firmId) return;
      (aiCropLocks[firmId] = aiCropLocks[firmId] || []).push(d.payload.bid);
    });

    // elapsedSec: seconds since the professor clicked Start deals, so
    // project()/resolve() can price an idle grower's leftover crop at the
    // CURRENT AI bid instead of always the decay floor (lead, after
    // reviewing a -$Xk projection at the very start of class: engine8 is
    // adding this param to project/resolve). 0 before deals_started_at is
    // set (lobby) or if it's somehow missing.
    var elapsedSec = 0;
    if (world && world.deals_started_at) {
      elapsedSec = Math.max(0, (Date.now() - new Date(world.deals_started_at).getTime()) / 1000);
    }

    // dealsClosedSec: seconds from Start deals to Close deals (fixed once
    // orders_started_at is set), so project()/orderOptions()/resolve() all
    // value an unsold crop at the AI bid AS OF WHEN DEALS CLOSED, not a
    // still-ticking live bid -- lead: "make projection, orders consequences
    // and resolve agree." null (engine should fall back to elapsedSec) while
    // still in the deals phase, since deals haven't closed yet.
    var dealsClosedSec = null;
    if (world && world.deals_started_at && world.orders_started_at) {
      dealsClosedSec = Math.max(0, (new Date(world.orders_started_at).getTime() - new Date(world.deals_started_at).getTime()) / 1000);
    }

    return {
      deals: engineDeals,
      orders: orders,
      aiCropLocks: aiCropLocks,
      aiCovered: (world && world.ai_covered) || [],
      elapsedSec: elapsedSec,
      dealsClosedSec: dealsClosedSec
    };
  }

  // the raw clause object a BO8.orderOptions option refers to (dealId +
  // clauseId), for building plain-word consequence text on the orders
  // screen -- orderOptions itself only returns a money delta, not the
  // clause's good/qty/penalty, and we must never show a raw id to a student
  // (lead: "use firm NAMES, never ids").
  function findClause(deals, dealId, clauseId) {
    var d = (deals || []).filter(function (x) { return x.id === dealId; })[0];
    if (!d || !d.terms || !d.terms.reading) return null;
    return (d.terms.reading.clauses || []).filter(function (c) { return c.id === clauseId; })[0] || null;
  }

  // A BO8.resolve() break entry's `key` is "dealId:clauseId" (dealId is a
  // UUID, which never contains ':', so splitting on the first ':' is safe).
  // Used to look the real clause back up for a plain-word break sentence
  // (lead: name the deal partner and the actual penalty paid, not just the
  // engine's {key,from,reason} object).
  function clauseForBreakKey(deals, key) {
    var i = (key || '').indexOf(':');
    if (i === -1) return null;
    return findClause(deals, key.slice(0, i), key.slice(i + 1));
  }

  // per-tier standalone, read off BO8.CONST so money deltas (which is what
  // orderOptions returns) can be shown to a student as GAIN (lead: "state
  // consequences as GAIN, not money") without needing the engine to expose
  // gain directly.
  function standaloneForTier(CONST, tier) {
    if (tier === 'grower') return CONST.STANDALONE_GROWER;
    if (tier === 'processor') return CONST.STANDALONE_PROCESSOR;
    if (tier === 'retailer') return CONST.STANDALONE_RETAILER;
    return 0;
  }

  // how many crops a grower still has to offer right now (GROWER_CAPACITY
  // minus every ai_sale decision it has already made this game).
  function cropsLockedCount(decisions, seatIndex) {
    return decisions.filter(function (d) { return d.kind === 'ai_sale' && d.seat_index === seatIndex; }).length;
  }

  // ---- tiered leaderboard (lead, after the 2-crop patch: "winners are by
  // tier" -- growers only compete against growers, etc). `firmsResult` is a
  // project()/resolve() result's `.firms` map; returns {grower:[...],
  // processor:[...], retailer:[...]}, each entry {id, gain, rank} sorted
  // descending by gain, rank 1-based and ties sharing a rank. ----
  // Only CLAIMED teams compete for a tier win (lead: "only CLAIMED teams are
  // ranked and can win a tier; AI-covered/unclaimed firms are listed below a
  // divider"). `teams` is the weed_teams rows so claimed-ness (name !==
  // archetype) can be checked; omitting it treats every firm as claimed
  // (back-compat for callers that don't have teams in scope).
  // Returns {grower: {ranked:[{id,gain,rank}], others:[{id,gain}]}, ...}.
  function rankByTier(firmsResult, teams) {
    var out = { grower: { ranked: [], others: [] }, processor: { ranked: [], others: [] }, retailer: { ranked: [], others: [] } };
    if (!firmsResult) return out;
    var claimedById = {};
    (teams || []).forEach(function (t) { claimedById[t.archetype] = t.name !== t.archetype; });
    var knowClaimed = !!teams;
    SEAT_ORDER.forEach(function (id) {
      if (!firmsResult[id]) return;
      var row = { id: id, gain: firmsResult[id].gain };
      var tier = out[tierOf(id)];
      if (!knowClaimed || claimedById[id]) tier.ranked.push(row);
      else tier.others.push(row);
    });
    Object.keys(out).forEach(function (tier) {
      out[tier].ranked.sort(function (a, b) { return b.gain - a.gain; });
      var rank = 0, seen = 0, lastGain = null;
      out[tier].ranked.forEach(function (row) {
        seen++;
        if (row.gain !== lastGain) { rank = seen; lastGain = row.gain; }
        row.rank = rank;
      });
      out[tier].others.sort(function (a, b) { return b.gain - a.gain; });
    });
    return out;
  }

  // ---- phase labels / transitions (DESIGN-v8.md section 8: exactly three
  // buttons: Start deals, Close deals and open orders, Reveal). ----
  var PHASE_LABEL = { lobby: 'Lobby', deals: 'Deals open', orders: 'Secret orders', revealed: 'Revealed' };
  var NEXT_PHASE = { lobby: 'deals', deals: 'orders', orders: 'revealed', revealed: null };

  function phaseClockRemaining(world) {
    if (world.phase === 'deals' && world.deals_started_at) {
      var elapsed = (Date.now() - new Date(world.deals_started_at).getTime()) / 1000;
      return Math.max(0, Math.round((world.deals_minutes || 25) * 60 - elapsed));
    }
    if (world.phase === 'orders' && world.orders_started_at) {
      var elapsed2 = (Date.now() - new Date(world.orders_started_at).getTime()) / 1000;
      return Math.max(0, Math.round((world.orders_minutes || 4) * 60 - elapsed2));
    }
    return null;
  }
  function fmtClock(secs) {
    if (secs == null) return '';
    var m = Math.floor(secs / 60), s = Math.floor(secs % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  return {
    SEAT_ORDER: SEAT_ORDER,
    cardIdForSeat: cardIdForSeat,
    seatForCardId: seatForCardId,
    tierOf: tierOf,
    ART_MAP: ART_MAP,
    artFor: artFor,
    genJoinCode: genJoinCode,
    money: money,
    signedMoney: signedMoney,
    escapeHtml: escapeHtml,
    fetchGameByCode: fetchGameByCode,
    fetchGameById: fetchGameById,
    fetchTeams: fetchTeams,
    fetchDeals: fetchDeals,
    fetchDecisions: fetchDecisions,
    insertDecision: insertDecision,
    subscribeTable: subscribeTable,
    makeQueue: makeQueue,
    makeTimeoutFetch: makeTimeoutFetch,
    writeWorldCAS: writeWorldCAS,
    newDealTerms: newDealTerms,
    sliderRanges: sliderRanges,
    dealsForFirm: dealsForFirm,
    confirmedBy: confirmedBy,
    allPartiesConfirmed: allPartiesConfirmed,
    needsMyConfirmation: needsMyConfirmation,
    statusLabel: statusLabel,
    statusClass: statusClass,
    statusLabelForStudent: statusLabelForStudent,
    statusClassForStudent: statusClassForStudent,
    heartbeatFresh: heartbeatFresh,
    readingElapsedMs: readingElapsedMs,
    latestPerSeat: latestPerSeat,
    buildEngineState: buildEngineState,
    cropsLockedCount: cropsLockedCount,
    findClause: findClause,
    clauseForBreakKey: clauseForBreakKey,
    standaloneForTier: standaloneForTier,
    rankByTier: rankByTier,
    PHASE_LABEL: PHASE_LABEL,
    NEXT_PHASE: NEXT_PHASE,
    phaseClockRemaining: phaseClockRemaining,
    fmtClock: fmtClock
  };
});
