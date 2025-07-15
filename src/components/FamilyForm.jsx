
import React from "react";

const ROLES = ["Mother", "Father", "Son", "Daughter", "Uncle", "Aunt"];

export default function FamilyForm({
  family, setFamily, storyType, setStoryType,
  length, setLength, timePeriod, setTimePeriod,
  context, setContext
}) {
  const addMember = () => setFamily([...family, { name: "", age: "", role: ROLES[0] }]);
  const update = (i, field, val) => {
    const c = [...family];
    c[i][field] = val;
    setFamily(c);
  };
  const remove = i => setFamily(f => f.filter((_, idx) => idx !== i));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Family Members</h2>
      {family.map((m, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            placeholder="Name"
            value={m.name}
            onChange={e => update(i, "name", e.target.value)}
            className="border px-2 py-1 rounded flex-1 text-black"
          />
          <input
            placeholder="Age"
            type="number"
            value={m.age}
            onChange={e => update(i, "age", e.target.value)}
            className="border px-2 py-1 rounded w-20 text-black"
          />
          <select
            value={m.role}
            onChange={e => update(i, "role", e.target.value)}
            className="border px-2 py-1 rounded w-32 text-black"
          >
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
          <button onClick={() => remove(i)} className="text-red-600">Remove</button>
        </div>
      ))}

      <button onClick={addMember} className="text-white font-semibold text-base mb-4">+ Add Family Member</button>

      <h2 className="text-xl font-semibold mb-2">Story Settings</h2>
      <div className="flex gap-2 mb-2">
        <select value={storyType} onChange={e => setStoryType(e.target.value)} className="border px-2 py-1 rounded text-black">
          <option>Adventure</option>
          <option>Mystery</option>
          <option>Horror</option>
          <option>Futuristic</option>
        </select>
        <select value={length} onChange={e => setLength(e.target.value)} className="border px-2 py-1 rounded text-black">
          <option value="short">2 Minutes</option>
          <option value="medium">5 Minutes</option>
          <option value="long">10 Minutes</option>
        </select>
        <select value={timePeriod} onChange={e => setTimePeriod(e.target.value)} className="border px-2 py-1 rounded text-black">
          <option value="current">Present Day</option>
          <option value="past">Past</option>
          <option value="future">Future</option>
        </select>
      </div>
      <textarea
        placeholder="Optional: seed idea..."
        value={context}
        onChange={e => setContext(e.target.value)}
        className="border px-2 py-1 rounded w-full h-24 text-black"
        maxLength={200}
      />
      <p className="text-sm text-gray-400">{200 - context.length} characters remaining</p>
    </div>
  );
}
