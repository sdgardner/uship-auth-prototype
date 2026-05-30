/* =================================================================
   FIND SHIPMENTS — carrier load board (post-signup landing).
   Rebuilt in Skid: app header + verify banner + filter rail +
   results table with standard / Book It Now rows.
   ================================================================= */

const { useState: useStateLB } = React;

// ---- Sample load data (mirrors the reference board) --------------
const LB_ROWS = [
  { id: 1, pickup: ["Tampa, FL 33592 US", "06/08/26"], delivery: ["Denver, CO 80640 US", "06/08/26"], trip: "1,859 mi.", title: "CCC Tampa Listing", weight: "0 lbs", time: "4d 4h", quote: "none", expandable: true },
  { id: 2, pickup: ["Austin, TX 78703 US", "05/29/26 – 05/30/26"], delivery: ["Dallas, TX 75252 US", "05/29/26 – 05/30/26"], trip: "214 mi.", title: "Sony Stereo System", weight: "400 lbs", time: "12h 8m", urgent: true, quote: "none" },
  { id: 3, pickup: ["Austin, TX 78703 US", "05/29/26 – 05/30/26"], delivery: ["Dallas, TX 75252 US", "05/29/26 – 05/30/26"], trip: "214 mi.", title: "Sony Stereo System", weight: "400 lbs", time: "12h 8m", urgent: true, quote: "none" },
  { id: 4, pickup: ["Austin, TX 78703 US", "05/29/26 – 05/30/26"], delivery: ["Dallas, TX 75252 US", "05/29/26 – 05/30/26"], trip: "214 mi.", title: "Woof! Woof!", weight: "4 lbs", time: "12h 8m", urgent: true, quote: "none" },
  { id: 5, bin: true, pickup: ["Georgetown, TX 78626 US", "05/30/26 – 06/12/26"], delivery: ["Tampa, FL 33601 US", "05/31/26 – 06/28/26"], trip: "1,156 mi.", title: "Couch", weight: "50 lbs", price: "$350" },
  { id: 6, pickup: ["Austin, TX 78759 US", "06/01/26 – 06/20/26"], delivery: ["Herndon, VA 20170 US", "06/01/26 – 06/20/26"], trip: "1,554 mi.", title: "append to answer · ui · test 1", weight: "300 lbs", time: "4d 4h", quote: "none" },
  { id: 7, pickup: ["Austin, TX 78759 US", "06/01/26 – 06/20/26"], delivery: ["Herndon, VA 20170 US", "06/01/26 – 06/20/26"], trip: "1,554 mi.", title: "append to answer · ui · test 1", weight: "300 lbs", time: "4d 4h", quote: "none" },
  { id: 8, bin: true, pickup: ["Austin, TX 78701 US", "05/30/26 – 06/12/26"], delivery: ["Tampa, FL 33601 US", "05/31/26 – 06/28/26"], trip: "1,155 mi.", title: "BIN Furniture Listing", weight: "2 lbs", price: "$178" },
  { id: 9, bin: true, pickup: ["Austin, TX 78701 US", "05/30/26 – 06/12/26"], delivery: ["Tampa, FL 33601 US", "05/31/26 – 06/28/26"], trip: "1,155 mi.", title: "BIN Furniture Listing", weight: "2 lbs", price: "$178" },
  { id: 10, bin: true, pickup: ["Smithville, TX 78957 US", "05/30/26 – 06/12/26"], delivery: ["Jacksonville, FL 32201 US", "05/31/26 – 06/28/26"], trip: "1,006 mi.", title: "Headboard", weight: "50 lbs", price: "$346" },
  { id: 11, pickup: ["Austin, TX 78701 US", "05/30/26 – 06/06/26"], delivery: ["Austin, TX 78701 US", "06/27/26 – 07/04/26"], trip: "0 mi.", title: "Polaris Ranger", weight: "0 lbs", time: "2d 2h", quote: "quotes", quoteText: "1 QUOTE", price: "$551 low" },
  { id: 12, pickup: ["Austin, TX 78701 US", "06/14/26 – 06/20/26"], delivery: ["Edinburg, TX 78539 US", "07/05/26 – 07/09/26"], trip: "305 mi.", title: "2021 BMW F 900 XR", weight: "0 lbs", time: "2d 1h", quote: "offer", price: "$371" },
  { id: 13, pickup: ["Austin, TX 78759 US", "06/01/26 – 06/20/26"], delivery: ["Herndon, VA 20170 US", "06/01/26 – 06/20/26"], trip: "1,554 mi.", title: "append char test 5", weight: "300 lbs", time: "3d 23h", quote: "none" },
  { id: 14, pickup: ["Olympia, WA 98502 US", "06/08/26"], delivery: ["Cheyenne, WY 82003 US", "06/08/26"], trip: "1,295 mi.", title: "uShipReactNative Saved Search Test", weight: "0 lbs", time: "4d 0h", quote: "none" },
  { id: 15, bin: true, pickup: ["Austin, TX 78759 US", "05/30/26 – 06/12/26"], delivery: ["Lake City, FL 32025 US", "05/31/26 – 06/28/26"], trip: "1,000 mi.", title: "Bedframe", weight: "150 lbs", price: "$320" },
  { id: 16, pickup: ["Seattle, WA 98101 US", "05/30/26"], delivery: ["Vancouver, BC V6C 1T2 CA", "05/31/26"], trip: "148 mi.", title: "CarsLightTrucks Listing", weight: "1,865 lbs", time: "12h 8m", urgent: true, quote: "quotes", quoteText: "1 QUOTE", price: "$100 low" },
  { id: 17, pickup: ["Austin, TX 78701 US", "06/08/26 – 06/13/26"], delivery: ["Orange Park, FL 32073 US", "06/13/26 – 06/18/26"], trip: "1,039 mi.", title: "Listing · 194", weight: "464 lbs", time: "4d 0h", quote: "offer", price: "$698" },
  { id: 18, pickup: ["Williston, ND 58801 US", "05/30/26 – 05/31/26"], delivery: ["Ishpeming, MI 49849 US", "06/01/26 – 06/02/26"], trip: "874 mi.", title: "Furniture Listing", weight: "2 lbs", time: "1d 12h", quote: "offer", price: "$500" },
];

function QuoteCell({ row }) {
  if (row.quote === "none") {
    return <span className="lb-badge lb-badge--none">NO QUOTES</span>;
  }
  if (row.quote === "quotes") {
    return (
      <span className="lb-quoteWrap">
        <span className="lb-badge lb-badge--quotes">{row.quoteText}</span>
        <span className="lb-quotePrice">{row.price}</span>
      </span>
    );
  }
  if (row.quote === "offer") {
    return (
      <span className="lb-quoteWrap">
        <span className="lb-badge lb-badge--offer">OFFER PRICE</span>
        <span className="lb-quotePrice">{row.price}</span>
      </span>
    );
  }
  return null;
}

function LoadRow({ row, expanded, onToggle }) {
  const cls =
    "lb-row" +
    (row.bin ? " lb-row--bin" : "") +
    (expanded ? " lb-row--open" : "");
  return (
    <>
      <div className={cls} onClick={onToggle} role="row">
        <div className="lb-cell lb-cell--loc">
          <span className="lb-thumb" aria-hidden="true">
            {row.bin ? <Icon.Truck /> : <Icon.Box />}
          </span>
          <span className="lb-locText">
            <span className="lb-city"><Icon.MapPin className="lb-pin" />{row.pickup[0]}</span>
            <span className="lb-dates">{row.pickup[1]}</span>
          </span>
        </div>
        <div className="lb-cell lb-cell--loc">
          <span className="lb-locText">
            <span className="lb-city"><Icon.MapPin className="lb-pin" />{row.delivery[0]}</span>
            <span className="lb-dates">{row.delivery[1]}</span>
          </span>
        </div>
        <div className="lb-cell lb-cell--trip">{row.trip}</div>
        <div className="lb-cell lb-cell--details">
          <span className="lb-title">{row.title}</span>
          <span className="lb-weight">{row.weight}</span>
        </div>
        <div className="lb-cell lb-cell--info">
          {row.bin ? (
            <span className="lb-bin">
              <span className="lb-binLabel">Book It Now <Icon.Zap className="lb-zap" /></span>
              <span className="lb-binPrice">{row.price}</span>
            </span>
          ) : (
            <>
              <span className={"lb-time" + (row.urgent ? " lb-time--urgent" : "")}>
                {row.urgent && <span className="lb-dot" aria-hidden="true" />}
                {row.time}
              </span>
              <QuoteCell row={row} />
            </>
          )}
        </div>
        <div className="lb-cell lb-cell--more">
          <button type="button" className="lb-moreBtn" aria-label={expanded ? "Collapse" : "Expand"}
            onClick={(e) => { e.stopPropagation(); onToggle(); }}>
            {expanded ? <Icon.ChevronUp /> : <Icon.ChevronDown />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="lb-expand" role="row">
          <div className="lb-expand__col">
            <div className="lb-expand__h">Location Details</div>
            <div className="lb-expand__line"><span>Pickup:</span> Residence / Home Business</div>
            <div className="lb-expand__line"><span>Delivery:</span> Residence / Home Business</div>
          </div>
          <div className="lb-expand__col">
            <div className="lb-expand__h">Details</div>
            <div className="lb-expand__line"><span>Items:</span> 1</div>
            <div className="lb-expand__line"><span>Trailer Type:</span> <strong>Not Specified</strong></div>
            <div className="lb-expand__line"><span>Listed By:</span> Shipping Customer</div>
          </div>
          <div className="lb-expand__action">
            <div className="lb-expand__noquote">No Quotes</div>
            <div className="lb-viewSplit">
              <button type="button" className="skid-btn skid-btn--primary skid-btn--lg lb-viewBtn">View</button>
              <button type="button" className="skid-btn skid-btn--primary skid-btn--lg lb-viewCaret" aria-label="More actions">
                <Icon.ChevronDown />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterToggle({ label, on, onChange, icon }) {
  return (
    <label className="lb-toggle">
      <button type="button" role="switch" aria-checked={on}
        className={"lb-switch" + (on ? " lb-switch--on" : "")}
        onClick={() => onChange(!on)}>
        <span className="lb-switch__knob" />
      </button>
      <span className="lb-toggle__label">{label}{icon}</span>
    </label>
  );
}

function FilterRail() {
  const [std, setStd] = useStateLB(true);
  const [exclusive, setExclusive] = useStateLB(true);
  const [bin, setBin] = useStateLB(true);
  const [mode, setMode] = useStateLB("location");

  const Acc = ({ label, value }) => (
    <button type="button" className="lb-acc">
      <span className="lb-acc__top">
        <span className="lb-acc__label">{label}</span>
        <Icon.ChevronDown />
      </span>
      <span className="lb-acc__value">{value}</span>
    </button>
  );

  return (
    <aside className="lb-rail">
      <div className="lb-saved">
        <div className="lb-rail__eyebrow">Saved Searches</div>
        <div className="lb-savedRow">
          <select className="skid-input skid-select lb-savedSelect"><option>Select</option></select>
          <button type="button" className="lb-saveLink">Save</button>
        </div>
      </div>

      <div className="lb-railHead">Filter Shipments</div>

      <div className="lb-modeToggle">
        <button type="button" className={"lb-mode" + (mode === "location" ? " lb-mode--on" : "")} onClick={() => setMode("location")}>
          <Icon.MapPin /> Location
        </button>
        <button type="button" className={"lb-mode" + (mode === "route" ? " lb-mode--on" : "")} onClick={() => setMode("route")}>
          <Icon.Route /> Along Route
        </button>
      </div>

      <div className="lb-field">
        <div className="lb-field__label">Pickup</div>
        <div className="lb-inputPin">
          <input className="skid-input" defaultValue="USA" />
          <span className="lb-inputPin__icon"><Icon.MapPin /></span>
        </div>
      </div>

      <div className="lb-field">
        <div className="lb-field__label lb-field__label--row">
          <span>Delivery</span>
          <Icon.ArrowUpDown className="lb-swap" />
        </div>
        <div className="lb-inputPin">
          <input className="skid-input" placeholder="Anywhere" />
          <span className="lb-inputPin__icon"><Icon.MapPin /></span>
        </div>
      </div>

      <div className="lb-toggles">
        <FilterToggle label="Standard shipments" on={std} onChange={setStd} />
        <FilterToggle label="Exclusive shipments" on={exclusive} onChange={setExclusive}
          icon={<Icon.Zap className="lb-toggleIcon lb-toggleIcon--purple" />} />
        <FilterToggle label="Book It Now" on={bin} onChange={setBin}
          icon={<Icon.Zap className="lb-toggleIcon lb-toggleIcon--blue" />} />
      </div>

      <div className="lb-accs">
        <Acc label="Categories" value="All Categories" />
        <Acc label="Weight" value="All Weights" />
        <Acc label="Pricing Type" value="" />
      </div>
    </aside>
  );
}

function BankVerifyBanner() {
  const [open, setOpen] = useStateLB(true);
  if (!open) return null;
  return (
    <div className="lb-verify" role="alert">
      <Icon.AlertCircle className="lb-verify__icon" />
      <div className="lb-verify__text">
        <strong>Verify your bank account</strong>
        <span>Call uShip Support to confirm the amounts of the 2 small deposits we made into your bank account <strong>1-800-698-7447</strong></span>
      </div>
      <a href="#" className="lb-verify__link" onClick={(e) => e.preventDefault()}>Learn More</a>
    </div>
  );
}

function FindShipments({ goto }) {
  const [expanded, setExpanded] = useStateLB(1);
  const [view, setView] = useStateLB("list");

  return (
    <div className="lb">
      <div className="lb-toolbar">
        <div className="lb-toolbar__left">
          <div className="lb-tool">
            <span className="lb-tool__label">Pickup Date</span>
            <button type="button" className="lb-tool__btn"><Icon.Calendar /> Any Date <Icon.ChevronDown /></button>
          </div>
          <div className="lb-tool">
            <span className="lb-tool__label">Sort By</span>
            <button type="button" className="lb-tool__btn"><Icon.ArrowUpDown /> Recently Listed <Icon.ChevronDown /></button>
          </div>
        </div>
        <div className="lb-toolbar__right">
          <span className="lb-tool__label">View</span>
          <div className="lb-viewToggle">
            <button type="button" className={"lb-viewOpt" + (view === "list" ? " lb-viewOpt--on" : "")} onClick={() => setView("list")} aria-label="List view"><Icon.ListIcon /></button>
            <button type="button" className={"lb-viewOpt" + (view === "grid" ? " lb-viewOpt--on" : "")} onClick={() => setView("grid")} aria-label="Grid view"><Icon.Grid /></button>
          </div>
        </div>
      </div>

      <div className="lb-body">
        <FilterRail />

        <section className="lb-results">
          <div className="lb-results__head">
            <h1 className="lb-results__count">429 Results</h1>
            <span className="lb-results__updated">Last updated 11:50am</span>
          </div>

          <div className="lb-table">
            <div className="lb-thead" role="row">
              <div className="lb-th">Pickup</div>
              <div className="lb-th">Delivery</div>
              <div className="lb-th">Trip</div>
              <div className="lb-th">Details</div>
              <div className="lb-th">Listing Info</div>
              <div className="lb-th lb-th--more">More</div>
            </div>
            {LB_ROWS.map((row) => (
              <LoadRow
                key={row.id}
                row={row}
                expanded={expanded === row.id}
                onToggle={() => setExpanded(expanded === row.id ? null : row.id)}
              />
            ))}
          </div>

          <div className="lb-pager">
            <button type="button" className="lb-page lb-page--on">1</button>
            <button type="button" className="lb-page">2</button>
            <button type="button" className="lb-page">3</button>
            <span className="lb-page lb-page--gap">…</span>
            <button type="button" className="lb-page">9</button>
            <button type="button" className="lb-page lb-page--next"><Icon.ChevronDown style={{ transform: "rotate(-90deg)" }} /></button>
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { FindShipments, BankVerifyBanner });
