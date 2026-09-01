import { motion } from 'framer-motion'

const AdminTable = ({ columns, data, emptyMessage = 'No records found' }) => {
  return (
    <div className="glass-card rounded-2xl border border-gold/15 overflow-hidden luxury-shadow bg-[#0d0d0d]/80">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white/80">
          <thead className="bg-black/80 border-b border-gold/15 text-gold text-xs uppercase tracking-wider font-semibold">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`p-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data && data.length > 0 ? (
              data.map((row, rowIdx) => (
                <motion.tr
                  key={row.id || rowIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: rowIdx * 0.03 }}
                  className="hover:bg-gold/5 transition-colors duration-200"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`p-4 ${col.className || ''}`}>
                      {col.render ? col.render(row, rowIdx) : row[col.accessorKey]}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-white/40 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTable
