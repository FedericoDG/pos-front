import { Box, Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { BiDollar } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

import { Pricelists } from '../../../interfaces';

interface Props {
  onOpen: () => void;
  onOpenModal: () => void;
  setinitialValues: Dispatch<SetStateAction<Pricelists>>;
}

export const useColumns = ({ onOpen, onOpenModal, setinitialValues }: Props) => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Pricelists>[]>(
    () => [
      {
        id: 'codigo',
        header: 'Código',
        cell: (row: CellContext<Pricelists, unknown>) => row.renderValue(),
        accessorKey: 'code',
      },
      {
        id: 'descripcion',
        header: 'Descripción',
        cell: (row: CellContext<Pricelists, unknown>) => row.renderValue(),
        accessorKey: 'description',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Pricelists, unknown>) => (
          <Box fontFamily="Poppins">
            <Menu placement="left-start">
              <MenuButton
                aria-label="Options"
                as={IconButton}
                fontSize={24}
                icon={<BsThreeDots />}
                variant="link"
              />
              <MenuList>
                <MenuItem
                  icon={<FaRegEdit />}
                  onClick={() => {
                    onOpen();
                    setinitialValues(row.original);
                  }}
                >
                  Editar
                </MenuItem>
                <MenuItem
                  icon={<BiDollar />}
                  onClick={() =>
                    navigate(`/panel/lista-de-precios/actualizar?id=${row.original.id}`)
                  }
                >
                  Actualizar Precios
                </MenuItem>
                <MenuItem
                  icon={<BiDollar />}
                  onClick={() =>
                    navigate(`/panel/lista-de-precios/actualizar-porcentaje?id=${row.original.id}`)
                  }
                >
                  Actualizar Precios (porcentaje)
                </MenuItem>
                <MenuItem
                  icon={<FaRegTrashAlt />}
                  onClick={() => {
                    onOpenModal();
                    setinitialValues(row.original);
                  }}
                >
                  Eliminar
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        ),
        meta: {
          align: 'center',
        },
        size: 80,
      },
    ],
    [navigate, onOpen, onOpenModal, setinitialValues]
  );

  return { columns };
};
