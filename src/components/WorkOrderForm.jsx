import React, { useState } from "react";

const OPTIONS = {
  mailTypes: ["PM Mail", "PM S/H", "NM Mail", "PUB MAIL", "LETTERMAIL", "METER"],
  componentTypes: [
    "Letter",
    "Reply Card",
    "Postcard",
    "Self-Mailer",
    "Buck slip",
    "Newsletter",
    "Survey",
    "Magazine",
    "Labels",
    "Envelopes",
    "Customized Product",
  ],
  finalSizes: [
    "8.5x11",
    "8.5x14",
    "11x17",
    "6x4",
    "5x7",
    "6x9",
    "3.5x8.5",
    "Custom size",
    "#10 WDW OE",
    "#10 NON-WDW Outer Env.",
    "#9 env",
    "BRE",
  ],
  paperTypes: [
    "Press Shell",
    "House Offset",
    "Lynx",
    "House Cover",
    "House Gloss Cover",
    "House Matte Text",
    "House Gloss Text",
    "Special Requested Paper",
  ],
  paperWeights: [
    "20#",
    "60#",
    "70#",
    "80#",
    "92.5#",
    "100#",
    "110#",
    "130#",
    "Custom",
  ],
  productionDepartments: [
    "Laser",
    "Press",
    "Jet",
    "Memjet",
    "Inkjet",
    "Fold",
    "Inserting",
  ],
  specialRequirements: [
    "MATCH",
    "Color-Duplex",
    "Color-Simplex",
    "B&W-Duplex",
    "B&W-Simplex",
  ],
  qcChecklistOptions: [
    "CSR SIGN-OFF",
    "SAMPLE VERIFICATION COMPLETE",
    "PICTURES NEEDED BEFORE INSERTING",
    "CLIENT PROOF APPROVAL",
    "DELIVERY DATE CONFIRMED",
  ],
  projectNoteOptions: ["Client Samples Requested"],
};

export default function WorkOrderGenerator() {
  const [form, setForm] = useState({
    docketNo: "",
    dropDate: "",
    quantity: "",
    projectName: "",
    mailType: "",
    projectDescription: "",
    finalOutputDescription: "",
    components: [],
    qcChecklist: [],
    projectNotes: [],
    output: "",
  });

  const [copied, setCopied] = useState(false);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleCheckbox = (value, listName) => {
    const list = form[listName];
    const newList = list.includes(value)
      ? list.filter((i) => i !== value)
      : [...list, value];
    setForm((prev) => ({ ...prev, [listName]: newList }));
  };

  const addComponent = () => {
    setForm((prev) => ({
      ...prev,
      components: [
        ...prev.components,
        {
          type: "",
          size: "",
          paper: "",
          weight: "",
          department: "",
          special: [],
        },
      ],
    }));
  };

  const updateComponent = (index, field, value) => {
    const newComponents = [...form.components];
    if (field === "special") {
      const special = newComponents[index].special;
      newComponents[index].special = special.includes(value)
        ? special.filter((s) => s !== value)
        : [...special, value];
    } else {
      newComponents[index][field] = value;
    }
    setForm((prev) => ({ ...prev, components: newComponents }));
  };

  const removeComponent = (index) => {
    const newComponents = form.components.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, components: newComponents }));
  };

  const generateOutput = () => {
    if (form.components.length === 0) {
      alert("Add at least one component to generate the work order.");
      return;
    }

    const componentText = form.components
      .map(
        (c) =>
          `${c.department} ${c.type} ${c.size} - ${c.paper} ${c.weight}${
            c.special.length ? " - " + c.special.join(", ") : ""
          }`
      )
      .join("\n");

    let summary = "PROJECT INFORMATION\n";

    if (form.projectName) 
      summary += `PROJECT NAME:\n${form.projectName}\n`;
    if (form.projectDescription)
      summary += `PROJECT DESCRIPTION:\n${form.projectDescription}\n`;
    if (form.finalOutputDescription)
      summary += `FINAL PRODUCT:\n${form.finalOutputDescription}\n`;

    summary += `\nCOMPONENTS\n${componentText}`;

    if (form.qcChecklist.length > 0) {
      const qcText = form.qcChecklist.map((i) => `☐ ${i}`).join("\n");
      summary += `\n\nQUALITY CONTROL CHECKLIST\n${qcText}`;
    }

    if (form.projectNotes.length > 0) {
      const notesText = form.projectNotes.map((i) => `☐ ${i}`).join("\n");
      summary += `\n\nPROJECT NOTES\n${notesText}`;
    }

    // ✅ Append form metadata at the end
    summary += `\n\nTrello Template\n`;
    if (form.docketNo) summary += `${form.docketNo}`;
    if (form.projectName) summary += `: ${form.projectName}`;
    if (form.mailType) summary += `: ${form.mailType}`;
    if (form.quantity) summary += `: ${form.quantity}`;
    if (form.dropDate) {
      const [year, month, day] = form.dropDate.split("-");
      summary += `: ${month}-${day}\n`;
    }

    setForm((prev) => ({ ...prev, output: summary }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(form.output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Order Generator</h1>

      {/* New Fields */}

      <div className="mb-4">
        <label className="block font-semibold">Docket No.</label>
        <input
          type="number"
          min="0"
          value={form.docketNo}
          onChange={(e) => handleChange("docketNo", e.target.value)}
          className="w-full border p-2"
          placeholder="Enter docket number"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Drop Date</label>
        <input
          type="date"
          value={form.dropDate}
          onChange={(e) => handleChange("dropDate", e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Quantity</label>
        <input
          type="text"
          value={form.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
          className="w-full border p-2"
          placeholder="Enter quantity"
        />
      </div>

      {/* Existing Fields */}

      <div className="mb-4">
        <label className="block font-semibold">Project Name</label>
        <input
          type="text"
          value={form.projectName}
          onChange={(e) => handleChange("projectName", e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Mail Type</label>
        <select
          value={form.mailType}
          onChange={(e) => handleChange("mailType", e.target.value)}
          className="w-full border p-2"
        >
          <option value="">Select Mail Type</option>
          {OPTIONS.mailTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Project Description</label>
        <textarea
          value={form.projectDescription}
          onChange={(e) => handleChange("projectDescription", e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Final Output Description</label>
        <textarea
          value={form.finalOutputDescription}
          onChange={(e) => handleChange("finalOutputDescription", e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Components</h2>
      {form.components.map((c, index) => (
        <div key={index} className="border p-4 mb-4 rounded">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <select
              value={c.department}
              onChange={(e) => updateComponent(index, "department", e.target.value)}
              className="border p-1"
            >
              <option value="">Department</option>
              {OPTIONS.productionDepartments.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <select
              value={c.type}
              onChange={(e) => updateComponent(index, "type", e.target.value)}
              className="border p-1"
            >
              <option value="">Type</option>
              {OPTIONS.componentTypes.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <select
              value={c.size}
              onChange={(e) => updateComponent(index, "size", e.target.value)}
              className="border p-1"
            >
              <option value="">Size</option>
              {OPTIONS.finalSizes.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <select
              value={c.paper}
              onChange={(e) => updateComponent(index, "paper", e.target.value)}
              className="border p-1"
            >
              <option value="">Paper</option>
              {OPTIONS.paperTypes.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <select
              value={c.weight}
              onChange={(e) => updateComponent(index, "weight", e.target.value)}
              className="border p-1"
            >
              <option value="">Weight</option>
              {OPTIONS.paperWeights.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-semibold">Special Requirements</label>
            {OPTIONS.specialRequirements.map((req) => (
              <label key={req} className="inline-flex items-center mr-3 mt-1">
                <input
                  type="checkbox"
                  checked={c.special.includes(req)}
                  onChange={() => updateComponent(index, "special", req)}
                  className="mr-1"
                />
                {req}
              </label>
            ))}
          </div>

          <button
            onClick={() => removeComponent(index)}
            className="mt-2 text-red-600 hover:underline text-sm"
          >
            Remove Component
          </button>
        </div>
      ))}

      <button
        onClick={addComponent}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
      >
        Add Component
      </button>

      <h2 className="text-xl font-semibold mb-2">Quality Control Checklist</h2>
      {OPTIONS.qcChecklistOptions.map((opt) => (
        <label key={opt} className="block">
          <input
            type="checkbox"
            checked={form.qcChecklist.includes(opt)}
            onChange={() => toggleCheckbox(opt, "qcChecklist")}
            className="mr-2"
          />
          {opt}
        </label>
      ))}

      <h2 className="text-xl font-semibold mt-6 mb-2">Project Notes</h2>
      {OPTIONS.projectNoteOptions.map((opt) => (
        <label key={opt} className="block">
          <input
            type="checkbox"
            checked={form.projectNotes.includes(opt)}
            onChange={() => toggleCheckbox(opt, "projectNotes")}
            className="mr-2"
          />
          {opt}
        </label>
      ))}

      <button
        onClick={generateOutput}
        className="bg-green-600 text-white px-4 py-2 mt-6 rounded hover:bg-green-700"
      >
        Generate Work Order
      </button>

      {form.output && (
        <div className="relative mt-6">
          <textarea
            value={form.output}
            readOnly
            rows={10}
            className="w-full p-3 border border-gray-400 rounded bg-gray-100 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition"
            title="Copy to Clipboard"
          >
            📋
          </button>
          {copied && (
            <div className="absolute top-2 right-10 text-green-600 text-xs font-semibold">
              Copied!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
