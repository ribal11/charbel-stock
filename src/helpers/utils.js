import { cloneDeep, isEmpty } from "lodash";
import moment from "moment/moment";

export const customTableSearch = (filterText, data, FilterOptions = null) => {
  let searchedValue = filterText.toLowerCase();
  let regExDateFormat = /^[0-9]{2}(\/|-)[0-9]{2}(\/|-)[0-9]{4}/; // start with DD/MM/YYYY or DD-MM-YYYY or MM/DD/YYYY or MM-DD-YYYY
  let regExDateFormat2 = /^[0-9]{4}(\/|-)[0-9]{2}(\/|-)[0-9]{2}/; // start with YYYY/DD/MM or YYYY-DD-MM or YYYY/MM/DD or YYYY-MM-DD
  let dataFiltered = [];

  let includedColumns = !isEmpty(FilterOptions)
    ? FilterOptions.filter((e) => e.isSelected).map((e) => e.columnName)
    : data.length > 0
    ? Object.keys(data[0])
    : [];

  if (searchedValue) {
    dataFiltered = data.filter((row) => {
      let getRow = true;
      if (searchedValue) {
        getRow = false;

        for (let key of includedColumns) {
          let value = row[key];

          if (
            value &&
            (regExDateFormat.test(value) ||
              regExDateFormat2.test(value) ||
              typeof value.getMonth === "function")
          ) {
            getRow =
              getRow ||
              moment(value)
                .format("DD/MM/YYYY")
                .includes(searchedValue.trim()) ||
              moment(value)
                .format("DD-MM-YYYY")
                .includes(searchedValue.trim()) ||
              value.toString().toLowerCase().includes(searchedValue.trim());
          } else if (value) {
            getRow =
              getRow ||
              value.toString().toLowerCase().includes(searchedValue.trim());
          }
        }
      }

      return getRow;
    });
  } else {
    dataFiltered = cloneDeep(data);
  }
  return dataFiltered;
};
export const getCategory = (item) => {
  const index = item.serno.indexOf("-");
  const code = item.serno.substring(0, index).toUpperCase();
  switch (code) {
    case "C099":
      return "Miscellaneous";
    case "C903":
      return "Arcos light";
    case "C904":
      return "SLV Elekt. Gmbh";
    case "C906":
      return "COOPER Luminaires";
    case "C907":
      return "DISANO Luminaires";
    case "C860":
      return "Batten";
    case "C870":
      return "TL.  LUMINAIRES";
    case "C570":
      return "LED Luminaires Factory";
    case "C905":
      return "LENA Luminaires";
    case "C770":
      return "LIT-LED Drivers&Emerg.Bat";
    case "C793":
      return "LIT-Smart Switch";
    case "C794":
      return "LIT-Con.Cab.For T5Led Bat";
    case "C701":
      return "LIT-LED Lamps MR16";
    case "C704":
      return "LIT-LED PL L Lamps";
    case "C700":
      return "LIT-T LED Lamps";
    case "C707":
      return "LIT-LED E27&B22 bulb";
    case "C705":
      return "LIT-LED filament bulb";
    case "C708":
      return "LIT-LED Candle & Lustre";
    case "C709":
      return "LIT-LED G9";
    case "C703":
      return "LIT-LED Aluminium Profile";
    case "C760":
      return "LIT-LED Decorative Spots";
    case "C710":
      return "LIT-LED Floodlight Lumina";
    case "C730":
      return "LIT-LED Indoor Luminaires";
    case "C702":
      return "LIT-LED Strip";
    case "C750":
      return "LIT-LED Waterproof Lumina";
    case "C711":
      return "LIT-LED high bay";
    case "C731":
      return "LIT-LED Indoor surface";
    case "C790":
      return "LIT-LED Divers";
    case "C733":
      return "LIT-LED Plafonnier";
    case "C734":
      return "LIT-LED Slim Downlight";
    case "C791":
      return "LIT-Street Lights Solar";
    case "C792":
      return "LIT-Flood Lights Solar";
    case "C951":
      return "OPPLE-LED T5 batten";
    case "C952":
      return "OPPLE-LED Downlight";
    case "C956":
      return "OPPLE-LED Luminaires";
    case "C960":
      return "OPPLE-LED Floodlt Lumi";
    case "C946":
      return "OPPLE-LED Decorat.Lumin";
    case "C947":
      return "OPPLE-LED Track Lumin.";
    case "C948":
      return "OPPLE-LEDHighbay Luminair";
    case "C949":
      return "OPPLE-LEDWaterproof Lumin";
    case "C965":
      return "OPPLE-LED Street Lighting";
    case "C966":
      return "OPPLE-LED SENSOR&DRIVER";
    case "C955":
      return "OPPLE-LED filament";
    case "C957":
      return "OPPLE-LED T8";
    case "C950":
      return "OPPLE-LED strip";
    case "C954":
      return "OPPLE-LED-Bulb";
    case "C953":
      return "OPPLE-LED PLAFONNIER";
    case "C958":
      return "OPPLE-LED Candle";
    case "C959":
      return "OPPLE-LED Dichroic";
    case "C804":
      return "CD-M Electronic Ballast";
    case "C800":
      return "Electronic Ballast";
    case "C150":
      return "Outdoor Ballasts";
    case "C805":
      return "PL Lamps Ballast";
    case "C801":
      return "Standard Ballast";
    case "C402":
      return "STARTERS";
    case "C803":
      return "TL-D / HF-R Electronic Ba";
    case "C802":
      return "TL 5 Electronic Ballast";
    case "C304":
      return "CD-M Lamps";
    case "C404":
      return "CFL-i Lamps";
    case "C405":
      return "CFL-ni Lamps/PL-C";
    case "C409":
      return "EcoHome Lamps";
    case "C408":
      return "Essential TL-5 Lamps";
    case "C400":
      return "Fluorescent Lamps";
    case "C063":
      return "LustreP45 & FlammeB35 Lam";
    case "C300":
      return "Mercury+Sodium Lamps";
    case "C301":
      return "Special Lamps";
    case "C403":
      return "TL-5 Lamps";
    case "C406":
      return "Tornado Lamps";
    case "C416":
      return "Tornado T2 Lamps";
    case "C306":
      return "TUV Lamps";
    case "C411":
      return "CFL-ni Lamps/PL-L";
    case "C412":
      return "CFL-ni Lamps/PL-T";
    case "C507":
      return "LED-Floodlights Outdoor";
    case "C506":
      return "LED-Industrial Luminaires";
    case "C503":
      return "LED-Outdoor Luminaires Sa";
    case "C509":
      return "LED-P45 & Flammes B35 Lam";
    case "C508":
      return "LED - Battens";
    case "C511":
      return "LED - Bulb";
    case "C514":
      return "LED - PLC Lamps";
    case "C510":
      return "LED - T LED";
    case "C512":
      return "LED -T LED T5";
    case "C504":
      return "LED Lamps-Retail";
    case "C502":
      return "LED Lamp modul drive";
    case "C500":
      return "SPOT Luminaires";
    case "C501":
      return "LED Spots";
    case "C601":
      return "Lighting Control";
    case "C513":
      return "Customized LED Luminaire";
    case "C515":
      return "LED PANELS";
    case "C861":
      return "Imported Battens";
    case "C164":
      return "Industrial Luminaires";
    case "C161":
      return "Outdoor Projectors";
    case "C261":
      return "Outdoor Projectors";
    case "C811":
      return "SPOTS";
    case "C160":
      return "Street Lighting Lumi";
    case "C260":
      return "Street Lighting Lumi";
    case "C821":
      return "Waterproof Luminaire";
    case "C822":
      return "Waterproof Luminaire";
    case "C970":
      return "TRIDONIC EMconverterLed";
    case "C910":
      return "NORTHCLIFFE LUMINAIRE";
    case "C920":
      return "BES-A LUMINAIRE";
    case "C922":
      return "LUMIVEN LUMINAIRE";
    case "C923":
      return "LUMIVEN DRIVER";
    case "C939":
      return "LUXIONA DRIVER";
    case "C1002":
      return "PELSAN LED PANEL";
    case "C1003":
      return "PELSAN EMERG.BATT";
    case "C1004":
      return "PELSAN WATERPROOF LUMIN";
    case "C1005":
      return "PELSAN PLAFONNIER";
    case "C1010":
      return "PELSAN OUTDOOR BALLASTS";
    case "C1015":
      return "PELSAN OUTDOOR LIGHTING.";
    case "C1200":
      return "SOLAR PV PANEL";
    case "C1070":
      return "JISO LIGHTING LED";
    case "C1080":
      return "CLAMPCO OBST.LIGHT";
    case "C516":
      return "Led Plafonnier";
    default:
      return "no category";
  }
};
