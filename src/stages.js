export const stageCatalog = [
 ['water','Water removal','Temporary pumps and equipment to remove standing water.'],
 ['drying','Drying & dehumidifiers','Equipment rentals and moisture checks. Duration is an allowance, not a drying guarantee.'],
 ['demolition','Demolition & disposal','Remove damaged finishes and haul away debris.'],
 ['drainage','Interior drainage & sump system','Contractor-reviewed drainage, excavation, and permanent sump equipment.'],
 ['concrete','Concrete reinstatement','Patch the opened slab with separately calculated concrete.'],
 ['reconstruction','Reconstruction & finishing','Rebuild walls, floors, trim, and finishes.']
];
// id, label, unit, cost type, calculated quantity, explanation, selected by default
export const stageItems = {
 water:[
  ['pump','Temporary extraction pumps','pump','equipment',null,'Temporary rentals only; permanent sump pumps are in stage 4.',true],
  ['hoses','Hose rental','hose','equipment',null,'Rental hoses used with extraction pumps.',false],
  ['otherEquipment','Other extraction equipment','unit','equipment',null,'Describe equipment in quote notes.',false],
  ['delivery','Extraction delivery / pickup','job','fixed','one','A single combined delivery and pickup charge.',false],
  ['setup','Pump setup labor','hour','labor',null,'Contractor-entered hours.',true],
  ['monitoring','Extraction monitoring labor','hour','labor',null,'Contractor-entered monitoring hours.',false],
  ['removal','Pump removal labor','hour','labor',null,'Contractor-entered removal hours.',false]
 ],
 drying:[
  ['dehumidifiers','Industrial dehumidifiers','unit','equipment',null,'Equipment count and days are estimating allowances requiring contractor confirmation.',true],
  ['airMovers','Air mover rental','unit','equipment',null,'Optional air circulation equipment.',false],
  ['delivery','Drying delivery / pickup','job','fixed','one','Exclude delivery already included in rental prices.',false],
  ['monitoring','Moisture-monitoring labor','hour','labor',null,'Contractor-entered hours; drying must be verified.',true]
 ],
 demolition:[
  ['floorRemoval','Floor-covering removal','sq ft','labor','floor','Remove damaged floor covering. Does not include trench concrete.',false],
  ['insulationRemoval','Damaged insulation removal','sq ft','labor','demolitionWall','Independent quantity correction allowed.',false],
  ['trimRemoval','Damaged trim removal','linear ft','labor','trim','Remove damaged baseboards and trim.',false],
  ['studRemoval','Damaged stud removal','stud','labor',null,'Optional contractor-entered stud count.',false],
  ['dumpster','Dumpster / disposal charge','job','fixed','one','Do not add disposal already included in debris hauling.',false]
 ],
 drainage:[
  ['cutting','Slab cutting','linear ft','labor','cutLength','Allowance for two cuts along the actual drainage run; correct if needed.',true],
  ['slabRemoval','Slab breaking / removal','sq ft','labor','trenchArea','Concrete removal only. Volume is shown separately.',true],
  ['excavation','Excavation beneath slab','cu yd','labor','excavationVolume','Trench volume minus existing slab volume; not the full trench volume.',true],
  ['slabHauling','Slab hauling / disposal','cu yd','fixed','slabVolume','Separate from debris hauling in stage 3.',false],
  ['soilHauling','Soil hauling / disposal','cu yd','fixed','excavationVolume','Only excavation beneath the slab.',false],
  ['gravel','Drainage gravel','cu yd','material','gravelVolume','Enter a gravel quantity or an explicit gravel fill-depth allowance.',true],
  ['pipe','Drain piping & installation','linear ft','combined','drainLength','Material and installation labor priced separately.',true],
  ['fittings','Drain fittings','fitting','material',null,'Contractor-entered fitting count.',false],
  ['basins','Sump basins & installation','basin','combined','sumps','Override basin quantity independently.',true],
  ['pumps','Permanent sump pumps & installation','pump','combined','sumps','Permanent pumps, separate from stage 1 extraction rentals.',true],
  ['discharge','Discharge piping & installation','linear ft','combined',null,'Enter actual discharge length; it is not the drainage run.',false],
  ['connections','Discharge connections','connection','combined',null,'Contractor-entered quantity.',false],
  ['backup','Backup pump allowance','job','fixed','one','Optional separately priced allowance.',false],
  ['electrical','Sump electrical-work allowance','job','fixed','one','Optional specialist work, separately priced.',false]
 ],
 concrete:[
  ['concrete','Concrete material & placement','cu yd','combined','concreteVolume','Volume uses patch thickness, not total trench depth. Waste applies to material only.',true],
  ['delivery','Concrete delivery / minimum-load charge','job','fixed','one','Exclude charges already included in the material rate.',false],
  ['finishing','Concrete finishing labor','sq ft','labor','patchArea','Finishing is separate from placement; do not price it twice.',true]
 ]
};
export function defaultStageItem(stage,def){const [id,,,,auto,,selected]=def;return {selected,quantity:auto==='one'?'1':'',days:'1',rate:'',material:'',labor:'',waste:'0',payer:'contractor',...(stage==='water'&&id==='pump'?{quantity:'1'}:{}),...(stage==='drying'&&id==='dehumidifiers'?{quantity:'2',days:'3'}:{}),...(stage==='drying'&&id==='airMovers'?{quantity:'2',days:'3'}:{}),...(stage==='concrete'&&id==='concrete'?{waste:'10'}:{})};}
export function defaultStages(){return Object.fromEntries(stageCatalog.map(([id])=>[id,{selected:['demolition','reconstruction'].includes(id),items:Object.fromEntries((stageItems[id]||[]).map(d=>[d[0],defaultStageItem(id,d)])),...(id==='drying'?{overlap:true}:{}),...(id==='drainage'?{length:'',width:'18',depth:'15',slabThickness:'',gravelFillDepth:'',useSumpRule:false}:{}),...(id==='concrete'?{length:'',width:'18',thickness:'4'}:{})}]));}
