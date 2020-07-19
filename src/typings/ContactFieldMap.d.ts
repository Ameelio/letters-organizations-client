interface FieldMap {
  field: string;
  index: number | null;
}

interface ContactFieldMap {
  firstName: FieldMap;
  lastName: FieldMap;
  inmateNumber: FieldMap;
  facilityName: FieldMap;
  facilityPostal: FieldMap;
  facilityState: FieldMap;
  facilityCity: FieldMap;
  facilityAddress: FieldMap;
  unit: FieldMap;
  dorm: FieldMap;
}
